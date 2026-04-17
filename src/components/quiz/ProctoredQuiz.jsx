import React, { useRef, useEffect, useState } from 'react';
import GenericButton from '../UI/GenericButton';
import { auth } from '../../firebase'; 
const ProctoredQuiz = () => {
  const videoRef = useRef(null);
  const [warningCount, setWarningCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isExamTerminated, setIsExamTerminated] = useState(false);

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

  // 2. Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !isExamTerminated) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAutoSubmit("Time Expired!");
    }
  }, [timeLeft, isExamTerminated]);

  // 3. Strict Anti-Cheat (Tab Switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isExamTerminated) {
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
  }, [isExamTerminated]);

  const handleAutoSubmit = (reason) => {
    setIsExamTerminated(true);
    alert(`Exam Terminated: ${reason}`);
    // Yahan Firebase par data bhej sakte ho status: "failed" ke saath
  };

  // Seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isExamTerminated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0D17] text-white p-10">
        <div className="text-center p-12 bg-red-900/20 border border-red-500 rounded-[3rem]">
          <h1 className="text-5xl font-black mb-4">EXAM TERMINATED</h1>
          <p className="text-slate-400">Your session was closed due to security violations or timeout.</p>
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
            <p className="text-xs text-slate-500">Secure Examination Environment</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-black text-cyan-400">{formatTime(timeLeft)}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Time Remaining</p>
          </div>
        </div>

        {/* Question Section */}
        <div className="space-y-8 py-4">
          <div className="flex gap-4 items-start">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">Q1</span>
            <h3 className="text-xl font-bold leading-relaxed">
              Identify the output: <br/>
              <code className="bg-black/50 p-1 rounded text-pink-400">console.log(typeof null);</code>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['"null"', '"undefined"', '"object"', '"number"'].map((opt, i) => (
              <button key={i} className="group relative p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500 transition-all text-left overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 font-medium text-slate-300 group-hover:text-white flex justify-between">
                  {opt}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">SELECT</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-between items-center border-t border-white/5 pt-8">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Question 1 of 20</span>
          <GenericButton label="Save & Next" color="#2563eb" />
        </div>
      </div>

      {/* Proctoring Side Panel */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="relative rounded-3xl overflow-hidden border-2 border-blue-500/30 bg-black shadow-2xl aspect-video lg:aspect-square">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black tracking-widest uppercase">Live Proctoring</span>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[9px] font-bold">
            USER_ID: {auth.currentUser?.uid?.slice(0, 8).toUpperCase()}
          </div>
        </div>

        {/* Warning Indicator */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Integrity Status</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${warningCount >= s ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-slate-700'}`} />
            ))}
          </div>
          <p className="text-[10px] mt-3 text-red-400 font-bold italic">
            {warningCount === 0 ? "No violations detected." : `${warningCount} Warnings Issued!`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProctoredQuiz;