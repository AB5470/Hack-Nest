import { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase'; 
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
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
import AddQuestion from './components/admin/AddQuestion';

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
    <Router>
      <div className="app-container">
        <nav className="navbar-custom" style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '0 15px', minHeight: '70px', background: '#1e293b', 
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: '10px 0', fontWeight: '900', color: 'white', fontSize: '1.2rem' }}>HACK_NEST</h2>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' }}>
            {user && (
              <Link to="/quiz" style={{ textDecoration: 'none' }}>
                <GenericButton label="Quiz" color="#2563eb" className="px-3 py-1 text-[10px]" />
              </Link>
            )}
            {user && isSystemAdmin && (
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
                <LiquidToggle currentRole={role} setRole={setRole} />
              </div>
            )}
          </div>
        </nav>

        <main style={{ paddingTop: '100px', paddingBottom: '50px', width: '100%', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 70px)', boxSizing: 'border-box' }}>
          <Routes>
            <Route path="/" element={
              user ? (
                <div style={{ width: '100%', padding: '0 20px' }}>
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

                  {role === 'admin' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      {/* Manage Questions Link */}
                      <Link to="/add-questions" style={{ textDecoration: 'none' }}>
                        <GenericButton label="Manage Quiz Questions" color="#8b5cf6" />
                      </Link>
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15vh', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', padding: '70px 40px', width: '100%', maxWidth: '750px', background:'linear-gradient(to right,  #06B6D4, #0F172A )', backdropFilter: 'blur(20px)', borderRadius: '40px', boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}>
                    <h1 style={{ color: '#08163e', fontSize: '4.5rem', fontWeight: '900', margin: 0, letterSpacing: '-3px', textTransform: 'uppercase', textShadow: '0 0 25px rgba(6, 33, 185, 0.5)', position: 'relative', zIndex: 10 }}>
                      Welcome to <span style={{ color: '#0F172A ', textShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}>HACKNEST</span>
                    </h1>
                    <p style={{ color: '#06b4ffb7', fontSize: '1.25rem', maxWidth: '600px', margin: '0 20px', textAlign: 'center', zIndex: 10 }}>Secure your identity. Start innovating.</p>
                    <button onClick={handleLogin} style={{ padding: '16px 36px', background: 'linear-gradient(to right, #0F172A , #06B6D4)', border: 'none', borderRadius: '20px', color: '#fff', fontSize: '1.15rem', fontWeight: '800', cursor: 'pointer', zIndex: 10 }}>Sign in with Google</button>
                  </div>
                </div>
              )
            } />
            <Route path="/quiz" element={user ? <ProctoredQuiz /> : <h1 className="text-white text-center">Please Login First</h1>} />
            <Route path="/add-questions" element={isSystemAdmin ? <AddQuestion /> : <h1 className="text-white text-center mt-10">Access Denied</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;