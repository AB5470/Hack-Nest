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
import LandingPage from './components/pages/LandingPage';
import AboutUs from './components/pages/AboutUs';

emailjs.init("lDxiig5Y5ZDnunyBx"); 

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student'); 
  const [isSystemAdmin, setIsSystemAdmin] = useState(false); 
  const [isRegistered, setIsRegistered] = useState(false); 
  const [studentData, setStudentData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showLoginCard, setShowLoginCard] = useState(false);

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

  const handleLogout = () => { 
    signOut(auth); 
    setShowLoginCard(false); 
  };

  const handleRegistrationComplete = (data) => {
    setStudentData(data);
    setIsRegistered(true);
  };

  /* Cyberpunk Loading Screen */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020c1b] font-mono">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-cyan-400 text-xs tracking-widest mt-5 uppercase">
          INITIALIZING SECURE_CORE...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen w-full bg-gradient-to-br from-[#020c1b] via-[#030f1e] to-[#050a14] relative overflow-x-hidden text-slate-100 font-sans">
        {/* Core Matrix Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#00dcf008_1px,transparent_1px),linear-gradient(to_bottom,#00dcf008_1px,transparent_1px)] bg-[size:45px_45px]"></div>
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[60px] pointer-events-none z-0"></div>

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[#020c1b]/85 backdrop-blur-xl border-b border-cyan-500/15">
          <Link to="/" onClick={() => setShowLoginCard(false)}>
            <h2 className="m-0 font-black font-mono text-cyan-200/50 text-lg tracking-widest drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              HACK_NEST
            </h2>
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <Link to="/quiz">
                <GenericButton label="Quiz Tracker" color="#00e8ff" className="px-3 py-1" />
              </Link>
            )}
            {user && isSystemAdmin && (
              <div className="scale-90 origin-right">
                <LiquidToggle currentRole={role} setRole={setRole} />
              </div>
            )}
          </div>
        </nav>

        {/* MAIN CONTAINER */}
        <main className="pt-28 pb-16 w-full max-w-7xl mx-auto relative z-10 px-4 box-border">
          <Routes>
            <Route path="/" element={
              user ? (
                /* AUTHENTICATED WORKSPACE */
                <div className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/65 backdrop-blur-md p-5 rounded-2xl border border-cyan-500/15 mb-10 shadow-2xl gap-4">
                    <div className="flex items-center gap-5">
                      <img 
                        src={user.photoURL} 
                        alt="profile" 
                        className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,232,255,0.3)]" 
                      />
                      <div>
                        <h3 className="m-0 text-slate-100 font-bold text-lg font-sans">
                          COMMANDER: {isRegistered ? studentData?.fullName : user.displayName?.split(' ')[0]}
                        </h3>
                        <p className="m-0 text-xs font-mono text-cyan-200/60 tracking-wider flex items-center gap-2">
                          STATUS: <span className={`font-semibold ${role === 'admin' ? 'text-purple-400' : 'text-cyan-400'} drop-shadow-[0_0_8px_currentColor]`}>
                            {role.toUpperCase()}_ACCESS
                          </span>
                          {!isSystemAdmin && role === 'admin' && (
                            <span className="text-[10px] bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40 font-mono">
                              (READ-ONLY DEMO)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* LOGOUT BUTTON AND GUEST ADMIN BUTTON GROUP */}
                    <div className="flex items-center gap-3">
                      {!isSystemAdmin && (
                        <button
                          onClick={() => setRole(role === 'admin' ? 'student' : 'admin')}
                          className={`px-3 py-2 text-xs font-mono font-semibold rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                            role === 'admin'
                              ? 'bg-purple-950/70 border-purple-500/50 text-purple-300 hover:bg-purple-900 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                              : 'bg-slate-800/80 border-purple-500/30 text-purple-400 hover:bg-purple-950/50 hover:border-purple-400'
                          }`}
                          title="Toggle Demo Admin Mode"
                        >
                          <span className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-purple-400 animate-pulse' : 'bg-cyan-400'}`}></span>
                          {role === 'admin' ? 'Exit Demo Admin' : 'Demo Admin Mode'}
                        </button>
                      )}
                      <GenericButton label="Logout" onClick={handleLogout} color="#ef4444" />
                    </div>
                  </div>

                  {role === 'admin' ? (
                    <div className="flex flex-col gap-10">
                      <Link to="/add-questions" className="w-max">
                        <GenericButton label="Set Quiz Questions 📝" color="#8b5cf6" />
                      </Link>
                      <CreateHackathon readOnly={!isSystemAdmin} />
                      <AdminDashboard readOnly={!isSystemAdmin} />   
                      <HackathonList role="admin" readOnly={!isSystemAdmin} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-10">
                      {isRegistered ? <StudentIDCard data={studentData} /> : <StudentRegister onComplete={handleRegistrationComplete} />}
                      <HackathonList role="student" />
                    </div>
                  )}
                </div>
              ) : (
                /* SCREEN TRANSITION NODE */
                !showLoginCard ? (
                  <LandingPage onSignInClick={() => setShowLoginCard(true)} />
                ) : (
                  /* SIGN IN TERMINAL */
                  <div className="relative flex justify-center items-center mt-[5vh] w-full min-h-[70vh] px-4">
                    {/* BACK BUTTON */}
                    <button 
                      onClick={() => setShowLoginCard(false)} 
                      className="fixed top-24 left-[4vw] bg-[#020c1b]/70 border border-cyan-400/35 rounded-md px-4 py-2 text-cyan-400 font-mono text-xs tracking-widest transition-all duration-200 hover:bg-cyan-400/15 hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] z-50 shadow-[0_0_15px_rgba(0,232,255,0.1)]"
                    >
                      ← RETURN
                    </button>

                    {/* CARD OBJECT */}
                    <div className="flex flex-col items-center gap-8 py-16 px-8 w-full max-w-3xl bg-gradient-to-r from-cyan-600 to-slate-900 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden z-10">
                      <h1 className="text-slate-950 text-5xl md:text-7xl font-black m-0 tracking-tighter uppercase drop-shadow-[0_0_25px_rgba(6,33,185,0.5)] text-center">
                        Welcome to <span className="text-slate-900 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">HACKNEST</span>
                      </h1>
                      
                      <p className="text-cyan-200/100 text-xl max-w-lg mx-5 text-center">
                        Secure your identity. Start innovating.
                      </p>
                      
                      <button 
                        onClick={handleLogin} 
                        className="px-9 py-4 bg-gradient-to-r from-slate-900 to-cyan-500 border-none rounded-2xl text-white text-lg font-extrabold cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-lg"
                      >
                        Sign in with Google
                      </button>
                    </div>
                  </div>
                )
              )
            } />
            <Route path="/quiz" element={user ? <ProctoredQuiz /> : <h1 className="text-white text-center font-mono mt-10 text-2xl">Please Login First</h1>} />
            <Route path="/add-questions" element={(isSystemAdmin || role === 'admin') ? <AddQuestion readOnly={!isSystemAdmin} /> : <h1 className="text-white text-center font-mono mt-10 text-2xl">Access Denied</h1>} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;