import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import GenericButton from '../UI/GenericButton';

const JoinEvent = ({ event }) => {
  const [loading, setLoading] = useState(true); // keep track of loading state for status check
  const [status, setStatus] = useState("none"); // "none", "enrolled", "blacklisted"
  
  const eventId = event.id;

  // --- 1. SINGLE SOURCE OF TRUTH (Check Enrollment & Blacklist) ---
  useEffect(() => {
    const checkStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if the student is already enrolled or blacklisted for this event
        const q = query(
          collection(db, "registrations"),
          where("eventId", "==", eventId),
          where("studentUid", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          if (data.status === "archived") {
            setStatus("blacklisted");
          } else {
            setStatus("enrolled");
          }
        } else {
          setStatus("none");
        }
      } catch (err) {
        console.error("Status Check Error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [eventId, auth.currentUser]);

  // --- 2. EMAIL LOGIC (Same as yours) ---
  const sendConfirmationEmail = (studentData, eventDetails) => {
    const templateParams = {
      user_name: studentData.fullName,
      user_email: auth.currentUser.email,
      event_name: eventDetails.title,
      student_id: studentData.studentID,
      location: eventDetails.location || "Remote",
      date: eventDetails.date || "TBD",
    };

    emailjs.send('service_4hs9vyj', 'template_aevyru8', templateParams, 'lDxiig5Y5ZDnunyBx')
      .catch((err) => console.error("Email Error:", err));
  };

  // --- 3. JOIN ACTION ---
  const handleJoin = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first to join the event!");
    if (status !== "none") return; // Already enrolled or blacklisted, so do nothing

    setLoading(true);
    try {
      const studentDoc = await getDoc(doc(db, "students", user.uid));
      if (!studentDoc.exists()) {
        alert("Complete profile first!");
        return;
      }

      const studentData = studentDoc.data();
      // Unique registration ID for this student-event pair
      const regId = `${user.uid}_${eventId}`;

      const registrationData = {
        studentUid: user.uid,
        studentName: studentData.fullName,
        studentUniqueId: studentData.studentID,
        college: studentData.college,
        eventTitle: event.title,
        eventId: eventId,
        enrolledAt: serverTimestamp(),
        location: event.location || "Remote",
        date: event.date || "TBD",
        fees: event.fee || 99, 
        status: "Confirmed",
        paymentStatus: "Paid"
      };

      await setDoc(doc(db, "registrations", regId), registrationData);
      
      setStatus("enrolled"); // UI update
      sendConfirmationEmail(studentData, event);
      //alert(`🎉 Registration successful!`);
      Swal.fire({
  title: '🎉 Registration Successful!',
  text: 'Confirmation mail sent! Check your inbox.',
  icon: 'success',
  showConfirmButton: false,
  timer: 2500,
  background: '#1f2937', // Dark Gray (Tailwind gray-800)
  color: '#fff',
  showClass: {
    popup: 'animate__animated animate__fadeInDown' // Fade in from top
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp' // Fade out to top
  }
});
      
    } catch (error) {

console.error("Join Error:", error);

  // SweetAlert Error Popup
  Swal.fire({
    icon: 'error',
    title: 'Opps! something went wrong.',
    text: error.message, //the error message from catch block
    background: '#111827', // Dark theme (Gray-900)
    color: '#fff',
    confirmButtonColor: '#4f46e5', // Indigo-600
    showClass: {
      popup: 'animate__animated animate__headShake'
    }
  });    } finally {
      setLoading(false);
    }
  };

  // --- 4. CONDITIONAL RENDERING (UI) ---
  if (loading) return <div className="text-gray-400">Checking status...</div>;

  if (status === "blacklisted") {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-xl text-red-500">
        <p className="font-bold">⚠️ Access Restricted</p>
        <p className="text-xs opacity-80">Your registration has been restricted.</p>
      </div>
    );
  }

  return (
    <GenericButton 
  label={status === "enrolled" ? '✓ Enrolled' : 'Join Event Now'}
  onClick={handleJoin}
  disabled={status === "enrolled"}
  // Color logic: Agar enrolled hai toh Green (#10b981), nahi toh Indigo (#4f46e5)
  color={status === "enrolled" ? "#32cd32" : "#4f46e5"} 
  className={`w-full ${status === "enrolled" ? 'opacity-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''}`}
/>
  );
};

export default JoinEvent;