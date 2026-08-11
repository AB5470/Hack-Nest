import { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase'; 
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

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
import AddQuestion from './components/admin/AddQuestion';
import LandingPage from './components/pages/LandingPage';

emailjs.init("lDxiig5Y5ZDnunyBx"); 

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student'); 
  const [isSystemAdmin, setIsSystemAdmin] = useState(false); 
  const [isDemoAdmin, setIsDemoAdmin] = useState(false); // Guest Admin Mode
  const [isRegistered, setIsRegistered] = useState(false); 
  const [studentData, setStudentData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showLoginCard, setShowLoginCard] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Check if logged-in user is a real Firebase System Admin
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
        setIsDemoAdmin(false);
        setRole('student');
        setIsRegistered(false);
        setStudentData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try { 
      await signInWithPopup(auth, provider); 
    } catch (error) { 
      console.error("Login failed:", error.message); 
    }
  };

  // ⚡ Enable Demo Admin Mode for logged-in non-admin user
  const handleEnableDemoAdmin = () => {
    setIsDemoAdmin(true);
    setRole('admin');
  };

  // Switch back to normal student view
  const handleDisableDemoAdmin = () => {
    setIsDemoAdmin(false);
    setRole('student');
  };

  const handleLogout = () => { 
    signOut(auth); 
    setUser(null);
    setIsSystemAdmin(false);
    setIsDemoAdmin(false);
    setRole('student');
    setShowLoginCard(false); 
  };

  const handleRegistrationComplete = (data) => {
    setStudentData(data);
    setIsRegistered(true);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#020c1b', fontFamily: "'Share Tech Mono', monospace"
      }}>
        <div style={{
          width: '50px', height: '50px', border: '4px solid rgba(0,220,240,0.15)',
          borderTop: '4px solid #00e8ff', borderRadius: '50%', animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#00e8ff', fontSize: '0.85rem', letterSpacing: '0.25em', marginTop: '20px', textTransform: 'uppercase' }}>
          INITIALIZING SECURE_CORE...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .app-root-wrapper { min-height: 100vh; width: 100%; background: linear-gradient(160deg, #020c1b 0%, #030f1e 55%, #050a14 100%); position: relative; overflow-x: hidden; }
        .cyber-grid-overlay { position: fixed; inset: 0; z-index: 1; pointer-events: none; background-image: linear-gradient(rgba(0,220,240,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,240,0.03) 1px, transparent 1px); background-size: 45px 45px; }
        .neon-radial-glow { position: fixed; top: 25%; left: 50%; transform: translate(-50%, -50%); width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%); filter: blur(60px); pointer-events: none; z-index: 1; }
      `}</style>

      <div className="app-root-wrapper app-container">
        <div className="cyber-grid-overlay" />
        <div className="neon-radial-glow" />

        {/* ── NAVBAR ── */}
        <nav className="navbar-custom" style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '0 4vw', minHeight: '65px', background: 'rgba(2, 12, 27, 0.85)', 
          backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0, 220, 240, 0.15)',
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setShowLoginCard(false)}>
            <h2 style={{ margin: 0, fontWeight: '900', fontFamily: "'Orbitron', sans-serif", color: '#e0f7ff', fontSize: '1.1rem', letterSpacing: '0.15em', textShadow: '0 0 15px rgba(0,240,255,0.4)' }}>
              HACK_NEST
            </h2>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user && (
              <Link to="/quiz" style={{ textDecoration: 'none' }}>
                <GenericButton label="Quiz Tracker" color="#00e8ff" className="px-3 py-1" />
              </Link>
            )}

            {/* Toggle Switch visible if actual System Admin */}
            {user && isSystemAdmin && (
              <div style={{ transform: 'scale(0.9)', transformOrigin: 'right center' }}>
                <LiquidToggle currentRole={role} setRole={setRole} />
              </div>
            )}
          </div>
        </nav>

        {/* ── MAIN CONTAINER ── */}
        <main style={{ paddingTop: '110px', paddingBottom: '60px', width: '100%', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 5, boxSizing: 'border-box' }}>
          <Routes>
            <Route path="/" element={
              user ? (
                /* AUTHENTICATED WORKSPACE */
                <div style={{ width: '100%', padding: '0 20px' }}>
                  
                  {/* USER STATUS BAR */}
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    background: 'rgba(8, 20, 38, 0.65)', backdropFilter: 'blur(16px)',
                    padding: '20px 30px', borderRadius: '16px', border: '1px solid rgba(0, 220, 240, 0.15)', 
                    marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', flexWrap: 'wrap', gap: '15px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img src={user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=User"} alt="profile" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #00e8ff', boxShadow: '0 0 10px rgba(0,232,255,0.3)' }} />
                      <div>
                        <h3 style={{ margin: 0, color: '#e8f8ff', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>
                          USER: {user?.displayName}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", color: 'rgba(140,200,220,0.8)', letterSpacing: '0.05em' }}>
                          MODE: <span style={{ color: role === 'admin' ? '#8b5cf6' : '#00e8ff', fontWeight: 'bold' }}>{role.toUpperCase()}_ACCESS {isDemoAdmin && '(DEMO EVALUATION)'}</span>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* DEMO ADMIN TOGGLE FOR NON-ADMIN LOGGED IN USERS */}
                      {!isSystemAdmin && (
                        !isDemoAdmin ? (
                          <button 
                            onClick={handleEnableDemoAdmin}
                            style={{
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.25))',
                              border: '1px solid #8b5cf6',
                              color: '#c084fc',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontFamily: "'Share Tech Mono', monospace",
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              boxShadow: '0 0 12px rgba(139, 92, 246, 0.3)'
                            }}
                          >
                            ⚡ TRY DEMO ADMIN VIEW
                          </button>
                        ) : (
                          <button 
                            onClick={handleDisableDemoAdmin}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid #ef4444',
                              color: '#fca5a5',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontFamily: "'Share Tech Mono', monospace",
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            ↩ EXIT DEMO ADMIN
                          </button>
                        )
                      )}

                      <GenericButton label="Logout" onClick={handleLogout} color="#ef4444" />
                    </div>
                  </div>

                  {/* CONTENT VIEW BASED ON CURRENT ROLE */}
                  {role === 'admin' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link to="/add-questions" style={{ textDecoration: 'none' }}>
                          <GenericButton label="Set Quiz Questions 📝" color="#8b5cf6" />
                        </Link>
                        {isDemoAdmin && (
                          <span style={{ color: '#a855f7', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.85rem' }}>
                            [ Demo Admin Active: You can test adding hackathons and questions ]
                          </span>
                        )}
                      </div>
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
                /* UNAUTHENTICATED FLOW */
                !showLoginCard ? (
                  <LandingPage onSignInClick={() => setShowLoginCard(true)} />
                ) : (
                  /* CLEAN GOOGLE SIGN-IN TERMINAL */
                  <div style={{ 
                    position: 'relative', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: '2vh', 
                    width: '100%', 
                    minHeight: '60vh', 
                    padding: '0 20px', 
                    boxSizing: 'border-box'
                  }}>
                    <button 
                      onClick={() => setShowLoginCard(false)} 
                      style={{ 
                        position: 'fixed', top: '95px', left: '4vw', background: 'rgba(2, 12, 27, 0.7)', 
                        border: '1px solid rgba(0, 232, 255, 0.35)', borderRadius: '6px', padding: '9px 18px', 
                        color: '#00e8ff', cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', zIndex: 1100 
                      }}
                    >
                      ← RETURN
                    </button>

                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '25px', 
                      padding: '45px 35px', 
                      width: '100%', 
                      maxWidth: '500px', 
                      background: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(0, 232, 255, 0.2)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '24px', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.6)', 
                      zIndex: 10 
                    }}>
                      <h1 style={{ color: '#00e8ff', fontSize: '2rem', fontWeight: '900', margin: 0, textTransform: 'uppercase', fontFamily: "'Orbitron', sans-serif" }}>
                        HACKNEST TERMINAL
                      </h1>
                      
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, textAlign: 'center', fontFamily: "'Share Tech Mono', monospace" }}>
                        Sign in with Google to access student dashboard & evaluation features.
                      </p>

                      <button 
                        onClick={handleLogin} 
                        style={{ 
                          width: '100%',
                          padding: '14px 24px', 
                          background: 'linear-gradient(135deg, #0284c7, #06b6d4)', 
                          border: 'none', 
                          borderRadius: '12px', 
                          color: '#fff', 
                          fontSize: '1rem', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                        }}
                      >
                        Sign in with Google
                      </button>
                    </div>
                  </div>
                )
              )
            } />
            
            <Route path="/quiz" element={user ? <ProctoredQuiz /> : <h1 className="text-white text-center font-mono mt-10">Please Login First</h1>} />
            <Route path="/add-questions" element={isSystemAdmin || isDemoAdmin ? <AddQuestion /> : <h1 className="text-white text-center font-mono mt-10">Access Denied</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;