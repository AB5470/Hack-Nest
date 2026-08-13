import React from 'react';
import GenericButton from '../UI/GenericButton';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen text-slate-100 font-sans px-4 py-8 max-w-6xl mx-auto flex flex-col items-center">
      
      {/* HERO SECTION */}
      <section className="w-full text-center py-12 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,232,255,0.2)]">
          // SYSTEM ORIGIN & MISSION
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black font-mono tracking-tight uppercase mb-6 drop-shadow-[0_0_25px_rgba(0,240,255,0.3)] text-center leading-tight">
          <span className="text-slate-950 font-black">EMPOWERING THE NEXT </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            GENERATION OF DEVELOPERS
          </span>
        </h1>
        
        <p className="w-full max-w-3xl mx-auto text-center text-slate-200 text-lg md:text-xl leading-relaxed font-sans">
          <strong className="text-cyan-400 font-semibold">HACKNEST</strong> is an all-in-one competitive hackathon management and skill assessment ecosystem designed to bridge the gap between talented innovators and real-world technology challenges.
        </p>
      </section>

      {/* MISSION & VISION CARDS */}
      <section className="w-full grid md:grid-cols-2 gap-8 my-12">
        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/30 shadow-xl relative overflow-hidden group hover:border-cyan-500/60 transition-all duration-300 flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
          <h2 className="text-2xl font-bold font-mono text-cyan-300 mb-4 flex items-center justify-center gap-2">
            <span className="text-cyan-400">01.</span> OUR MISSION
          </h2>
          <p className="text-slate-300 leading-relaxed font-sans">
            To cultivate a fair, transparent, and high-energy platform where students can test their technical logic, showcase innovative projects, and earn verified recognition without friction.
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-purple-500/30 shadow-xl relative overflow-hidden group hover:border-purple-500/60 transition-all duration-300 flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
          <h2 className="text-2xl font-bold font-mono text-purple-300 mb-4 flex items-center justify-center gap-2">
            <span className="text-purple-400">02.</span> OUR VISION
          </h2>
          <p className="text-slate-300 leading-relaxed font-sans">
            To become the core hub for tech talent assessment, replacing traditional evaluation methods with real-time proctored hackathons, live coding challenges, and dynamic skill tracking.
          </p>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="w-full my-16 text-center flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-mono text-slate-100 text-purple tracking-wider">
            WHY HACKNEST?
          </h2>
          <p className="text-cyan-300/80 text-sm font-mono mt-2 tracking-widest">
            BUILT WITH PRECISION FOR ADMINISTRATORS AND DEVELOPERS
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700/60 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold text-cyan-200 mb-2 font-mono">Proctored Assessments</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Integrates smart monitoring during quizzes and technical tests to ensure strict academic integrity and genuine skill evaluation.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700/60 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-cyan-200 mb-2 font-mono">Real-time Management</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Seamlessly create, host, and judge hackathons. Admin tools allow single-click updates and automated participant organization.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700/60 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="text-3xl mb-3">🪪</div>
            <h3 className="text-lg font-bold text-cyan-200 mb-2 font-mono">Digital Student IDs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated generation of verified digital identity cards for students upon registration, simplifying credentials verification.
            </p>
          </div>
        </div>
      </section>

      {/* TECH STACK / ARCHITECTURE SECTION */}
      <section className="w-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 my-16 text-center flex flex-col items-center justify-center">
        <h3 className="text-xl font-mono text-cyan-400 mb-3 font-bold tracking-wider">
          POWERED BY MODERN TECH STACK
        </h3>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-6 text-center">
          Engineered for performance, real-time sync, and security using state-of-the-art web technology.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 font-mono text-xs w-full">
          <span className="px-3.5 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(0,232,255,0.15)]">React.js</span>
          <span className="px-3.5 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(0,232,255,0.15)]">Tailwind CSS</span>
          <span className="px-3.5 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(0,232,255,0.15)]">Firebase Auth & Firestore</span>
          <span className="px-3.5 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(0,232,255,0.15)]">React Router</span>
          <span className="px-3.5 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(0,232,255,0.15)]">EmailJS</span>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="w-full text-center py-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold font-mono text-slate-100 mb-3 drop-shadow-[0_0_12px_rgba(0,232,255,0.2)]">
          READY TO SHAPESHIFT YOUR HACKATHON EXPERIENCE?
        </h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm text-center">
          Hundreds of students, innovators, and organizers already using HackNest today.
        </p>
        <div className="flex justify-center items-center">
          <Link to="/">
            <GenericButton label="EXPLORE HACKATHONS" color="#00e8ff" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;