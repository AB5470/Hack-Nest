import { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import GenericButton from '../UI/GenericButton'; // Path check kar lena bhai

const StudentRegister = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    fullName: '',
    college: '',
    phone: '',
    course: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      const studentID = `STU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      await setDoc(doc(db, "students", user.uid), {
        ...studentData,
        studentID: studentID,
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp()
      });

      alert(`Registration Successful! Your ID: ${studentID}`);
      if (onComplete) onComplete();
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto mt-12 mb-20 group font-sans">
      <div className="absolute -inset-1 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-cyan-500 rounded-[3rem] opacity-30 blur-2xl group-hover:opacity-50 transition duration-500 pointer-events-none"></div>
      
      <div className="relative w-full p-8 sm:p-10 bg-[#0B0D17]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-center">
        
        <div className="w-12 h-1.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full mb-8 shadow-[0_0_15px_rgba(217,70,239,0.5)]"></div>

        <div className="text-center mb-10 w-full relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-3">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Profile</span>
          </h2>
          <p className="text-slate-400 text-sm">Create your official Cyber Identity</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full relative z-10">
          <div className="flex flex-col gap-1.5 group/input">
            <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1">Full Name</label>
            <input type="text" required placeholder="e.g. Aayush Bhardwaj" className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all" onChange={(e) => setStudentData({...studentData, fullName: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1.5 group/input">
            <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1">WhatsApp Number</label>
            <input type="tel" required placeholder="10-digit mobile number" className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all" onChange={(e) => setStudentData({...studentData, phone: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1.5 group/input">
            <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1">College</label>
            <input type="text" required placeholder="Your College Name" className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all" onChange={(e) => setStudentData({...studentData, college: e.target.value})} />
          </div>

          {/* --- NAYA GENERIC BUTTON --- */}
          <GenericButton 
            label="Initialize Registration"
            type="submit"
            loading={loading}
            color="#d946ef" // Fuchsia color theme ke liye
            className="w-full mt-4"
          />
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;