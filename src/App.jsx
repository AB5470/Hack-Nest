import { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase'; 
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
// Routing Imports
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import CreateHackathon from './components/admin/CreateHackathon';
import HackathonList from './components/admin/HackathonList';
import StudentRegister from './components/students/StudentRegister';
import StudentIDCard from './components/students/StudentIDCard'; 
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';
import emailjs from '@emailjs/browser';
import LiquidToggle from './components/UI/LiquidToggle';
import GenericButton from './components/UI/GenericButton';
import ProctoredQuiz from './components/quiz/ProctoredQuiz';

emailjs.init("lDxiig5Y5ZDnunyBx"); 

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student'); 
  const [isSystemAdmin, setIsSystemAdmin] = useState(false); 
  const [isRegistered, setIsRegistered] = useState(false); 
  const [studentData, setStudentData] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const adminDoc = await getDoc(doc(db, "admins", currentUser.email));
          if (adminDoc.exists() && adminDoc.data().isAdmin === true) {
            setIsSystemAdmin(true);
            setRole('admin');
          } else {
            setIsSystemAdmin(false);
            setRole('student');
          }

          const studentDoc = await getDoc(doc(db, "students", currentUser.uid));
          if (studentDoc.exists()) {
            setIsRegistered(true);
            setStudentData(studentDoc.data()); 
          } else {
            setIsRegistered(false);
            setStudentData(null);
          }
        } catch (err) {
          console.error("Data Fetch Error:", err);
        }
      } else {
        setUser(null);
        setIsSystemAdmin(false);
        setRole('student');
        setIsRegistered(false);
        setStudentData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); } 
    catch (error) { console.error("Login failed:", error.message); }
  };

  const handleLogout = () => { signOut(auth); };

  const handleRegistrationComplete = (data) => {
    setStudentData(data);
    setIsRegistered(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f5ff]">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router> {/* Wrapper added */}
      <div className="app-container">
        {/* --- NAVIGATION BAR --- */}
        {/* --- UPDATED NAVIGATION BAR --- */}
<nav className="navbar-custom" style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '0 15px', // Mobile par padding kam kar di
  height: 'auto', // Auto height taaki wrap ho sake
  minHeight: '70px',
  background: '#1e293b', 
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
  flexWrap: 'wrap' // Sabse zaroori: overflow rokne ke liye
}}>
  <Link to="/" style={{ textDecoration: 'none' }}>
    <h2 style={{ 
      margin: '10px 0', 
      fontWeight: '900', 
      color: 'white', 
      fontSize: '1.2rem' // Mobile par logo thoda chota
    }}>HACK_NEST</h2>
  </Link>
  
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', // Gap kam kiya mobile ke liye
    padding: '5px 0'
  }}>
    {user && (
      <Link to="/quiz" style={{ textDecoration: 'none' }}>
        <GenericButton label="Quiz" color="#2563eb" className="px-3 py-1 text-[10px]" />
      </Link>
    )}
    
    {/* Toggle Container: Isko thoda scale down karenge agar screen choti ho */}
    {user && isSystemAdmin && (
      <div style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
        <LiquidToggle currentRole={role} setRole={setRole} />
      </div>
    )}
  </div>
</nav>

        {/* --- MAIN CONTENT AREA --- */}
        <main style={{ 
          paddingTop: '100px', 
          paddingBottom: '50px',
          width: '100%',
          maxWidth: '1400px', 
          margin: '0 auto', 
          minHeight: 'calc(100vh - 70px)',
          boxSizing: 'border-box'
        }}>
          
          <Routes>
            {/* ROUTE 1: Main Dashboard (Home) */}
            <Route path="/" element={
              user ? (
                <div style={{ width: '100%', padding: '0 20px' }}>
                  {/* Profile Section */}
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
                    padding: '20px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', 
                    marginBottom: '40px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img src={user.photoURL} alt="profile" style={{ width: '55px', height: '55px', borderRadius: '50%', border: '3px solid #2563eb' }} />
                      <div>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>Commander {isRegistered ? studentData?.fullName : user.displayName.split(' ')[0]}</h3>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>STATUS: <span style={{ color: role === 'admin' ? '#2563eb' : '#10b981' }}>{role.toUpperCase()}</span></p>
                      </div>
                    </div>
                    <GenericButton label="Log Out" onClick={handleLogout} color="#ef4444" />
                  </div>

                  {/* Role based rendering */}
                  {role === 'admin' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      <CreateHackathon />
                      <AdminDashboard />    
                      <HackathonList role="admin" />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      {isRegistered ? <StudentIDCard data={studentData} /> : <StudentRegister onComplete={handleRegistrationComplete} />}
                      <HackathonList role="student" />
                    </div>
                  )}
                </div>
              ) : (
                /* --- FUTURISTIC GLASS LOGIN SECTION --- */
<div style={{ 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '15vh', // Centered vertically
  width: '100%',
  padding: '0 20px',
  boxSizing: 'border-box',
}}>
  {/* The Glass Container (Styled like your Student ID card) */}
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
    padding: '70px 40px',
    width: '100%',
    maxWidth: '750px', // Perfect desktop width
    background:'linear-gradient(to right,  #06B6D4, #0F172A )', // Deep Dark Glass Base
    backdropFilter: 'blur(20px)', // Strong blur effect
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '40px',
    //border: '2px solid rgba(59, 130, 246, 0.2)', // Subdued Neon Blue border
    boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6), 0 0 30px rgba(59, 130, 246, 0.1)', // Outer glow
    position: 'relative', // For inner shine
    overflow: 'hidden',
  }}>
    {/* Upper Inner Shine/Reflection (Matches Event card style) */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '40%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
    }} />

    {/* Title Section with Cyber Glow */}
    <h1 style={{ 
      color: '#08163e',
      fontSize: '4.5rem', 
      fontWeight: '900', 
      margin: 0,
      letterSpacing: '-3px',
      textTransform: 'uppercase',
      textShadow: '0 0 25px rgba(6, 33, 185, 0.5)', // Subtle white text glow
      position: 'relative',
      zIndex: 10,
    }}>
      Welcome to <span style={{ 
        color: '#0F172A ', 
        textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 10px rgba(59, 130, 246, 0.5)' 
      }}>HACKNEST</span>
    </h1>
    
    {/* Description with High Contrast */}
    <p style={{ 
      color: '#06b4ffb7', // Light Indigo for high readability
      fontSize: '1.25rem', 
      maxWidth: '600px', 
      margin: '0 0 20px 0',
      lineHeight: '1.6',
      fontWeight: '500',
      opacity: 0.9,
      position: 'relative',
      zIndex: 10,
    }}>
      The unified ecosystem for the next generation of builders. <br/>
      <span style={{ 
        color: '#0ef1adc3', 
        fontWeight: '700', 
        borderBottom: '2px solid #09c8d2', 
        paddingBottom: '3px',
        display: 'inline-block',
        marginTop: '10px'
      }}>
        Secure your identity. Start innovating.
      </span>
    </p>
    
    {/* Professional Google Button with Glass/Tech Hover Effect */}
    <button 
      onClick={handleLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '16px 36px',
        background: 'linear-gradient(to right, #0F172A , #06B6D4)', // Hih contrast white
        border: 'none',
        borderRadius: '20px',
        color: '#0f172a', // Deep dark text
        fontSize: '1.15rem',
        fontWeight: '800',
        cursor: 'pointer',
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy transition
        position: 'relative',
        zIndex: 10,
        outline: 'none',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(59, 130, 246, 0.5)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
      }}
    >
      Sign in with Google
    </button>
  </div>
</div>
              )
            } />

            {/* ROUTE 2: Quiz Page */}
            <Route path="/quiz" element={user ? <ProctoredQuiz /> : <h1 className="text-white text-center">Please Login First</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;