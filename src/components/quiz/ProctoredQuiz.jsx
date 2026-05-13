import React, { useRef, useEffect, useState } from 'react';
import GenericButton from '../UI/GenericButton';
import { auth, db } from '../../firebase'; 
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';


const [isFacePresent, setIsFacePresent] = useState(true);

const ProctoredQuiz = () => {
  const videoRef = useRef(null);
  
  // --- States ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); 
  const [isExamTerminated, setIsExamTerminated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Webcam Start
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startVideo();
  }, []);

  // 2. Fetch Questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 3. Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !isExamTerminated && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAutoSubmit("Time Expired!");
    }
  }, [timeLeft, isExamTerminated, isSubmitted]);

  // 4. Anti-Cheat (Tab Switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isExamTerminated && !isSubmitted) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleAutoSubmit("Maximum Warnings Exceeded!");
          } else {
            alert(`WARNING ${newCount}/3: Do not leave the page!`);
          }
          return newCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isExamTerminated, isSubmitted]);

  // --- Handlers ---
  // --- Handlers ---
  const handleNext = () => {
    let finalScore = score; // Current score pakdo

    // Logic: Agar answer sahi hai toh score badhao
    if (selectedOption?.toString().trim() === questions[currentQuestion]?.correct?.toString().trim()) {
      finalScore = score + 1;
      setScore(finalScore);
      console.log("Score update hua:", finalScore);
    }

    // Next Question ya Submit
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null); 
    } else {
      // CRITICAL: Final score ko seedha function mein bhejo
      submitToFirebase(finalScore); 
    }
  };

  const submitToFirebase = async (finalCalculatedScore) => {
    try {
        setIsSubmitted(true);
        // State update ka wait kiye bina seedha calculated value save karo
        await addDoc(collection(db, "quizResults"), {
          userId: auth.currentUser?.uid || "Anonymous",
          userName: auth.currentUser?.displayName || "Guest",
          finalScore: finalCalculatedScore, // Yahan ab sahi score jayega
          totalQuestions: questions.length,
          timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
    }
  };

  const handleAutoSubmit = (reason) => {
    setIsExamTerminated(true);
    alert(`Exam Terminated: ${reason}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- UI Safety Guards ---
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0B0D17] text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold animate-pulse uppercase tracking-widest">Initializing Secure Environment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0D17] text-white">
        <div className="text-center p-10 border border-white/10 rounded-3xl bg-white/5">
          <h2 className="text-2xl font-bold text-red-400">Database Empty</h2>
          <p className="mt-2 text-slate-400 font-medium">Please add questions to your Firestore collection.</p>
        </div>
      </div>
    );
  }

  if (isExamTerminated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0D17] text-white p-10">
        <div className="text-center p-12 bg-red-900/20 border border-red-500 rounded-[3rem]">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">TERMINATED</h1>
          <p className="text-slate-400 font-bold italic">Security violation or session timeout detected.</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0D17] text-white p-10 font-sans">
        <div className="text-center p-12 bg-blue-900/20 border border-blue-500 rounded-[3rem]">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter text-blue-400">SUCCESS</h1>
          {/* Yahan 'score' state ka use ho raha hai */}
          <p className="text-2xl font-mono font-bold">Your Score: {score} / {questions.length}</p>
          <p className="text-slate-400 mt-4">Your response is locked in Firestore.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-10 bg-[#0B0D17] min-h-screen text-white font-sans">
      
      {/* Quiz Area */}
      <div className="flex-1 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 relative shadow-2xl">
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-500">Hackathon Round 01</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Secure Interface</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-black text-cyan-400">{formatTime(timeLeft)}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Time Remaining</p>
          </div>
        </div>

        {/* Question Section */}
        <div className="space-y-8 py-4">
          <div className="flex gap-4 items-start">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">Q{currentQuestion + 1}</span>
            <h3 className="text-xl font-bold leading-relaxed text-slate-100">
              {questions[currentQuestion]?.text}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestion]?.options?.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedOption(opt)}
                className={`group relative p-5 border rounded-2xl transition-all text-left overflow-hidden 
                ${selectedOption === opt ? 'border-blue-500 bg-blue-600/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/10 hover:border-blue-500/50'}`}
              >
                <span className={`relative z-10 font-medium transition-colors ${selectedOption === opt ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {opt}
                </span>
                {selectedOption === opt && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-between items-center border-t border-white/5 pt-8">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic">Encryption: Active</span>
          <div onClick={handleNext} className={!selectedOption ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}>
            <GenericButton 
              label={currentQuestion === questions.length - 1 ? "Finish Exam" : "Save & Next"} 
              color="#2563eb" 
            />
          </div>
        </div>
      </div>

      {/* Proctoring Side Panel */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="relative rounded-3xl overflow-hidden border-2 border-blue-500/30 bg-black shadow-2xl aspect-video lg:aspect-square">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale-[40%] contrast-125" />
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.15em] uppercase text-white">Live Proctoring</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Integrity Monitoring</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${warningCount >= s ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-slate-800'}`} />
            ))}
          </div>
          <p className={`text-[10px] mt-4 font-bold uppercase tracking-tighter ${warningCount > 0 ? 'text-red-400' : 'text-emerald-500'}`}>
             {warningCount > 0 ? `${warningCount} Violations Logged` : "System Status: Stable"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProctoredQuiz;