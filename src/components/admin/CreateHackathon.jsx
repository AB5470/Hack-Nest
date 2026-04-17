import { useState } from 'react';
import { db, auth } from '../../firebase'; // Path is correct based on your snippet
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';

const CreateHackathon = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: 'Remote',
    eventType: 'Hackathon', // Added Event Type
    fee: 0                  // Added Fee
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "hackathons"), {
        ...formData,
        fee: Number(formData.fee), // Converted to number so we can calculate payments later
        organizerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      
      Swal.fire({
        title: 'Mission Initialized!',
        text: `${formData.eventType} broadcasted to the network successfully.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        background: '#0f172a', /* slate-900 */
        color: '#10b981', /* emerald-500 */
        customClass: {
          popup: 'rounded-[2rem] shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/20 backdrop-blur-xl bg-slate-900/95'
        },
        showClass: { popup: 'animate__animated animate__zoomIn animate__faster' },
        hideClass: { popup: 'animate__animated animate__zoomOut animate__faster' }
      });

      // Reset the form back to defaults
      setFormData({ title: '', description: '', date: '', location: 'Remote', eventType: 'Hackathon', fee: 0 });
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Broadcast Failed',
        text: error.message,
        background: '#0f172a',
        color: '#f8fafc',
        customClass: { popup: 'rounded-[2rem] border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.2)] backdrop-blur-xl bg-slate-900/95' },
        showClass: { popup: 'animate__animated animate__zoomIn animate__faster' },
        hideClass: { popup: 'animate__animated animate__zoomOut animate__faster' }
      });
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mt-12 mb-20 group font-sans">
      {/* Background Glowing Aura */}
      <div className="absolute -inset-1 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-cyan-500 rounded-[3rem] opacity-30 blur-2xl group-hover:opacity-50 transition duration-500 pointer-events-none"></div>
      
      {/* Main Glassmorphic Card */}
      <div className="relative w-full p-8 sm:p-12 bg-[#0B0D17]/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col transition-all duration-300 group-hover:border-white/20">
        
        {/* Subtle Cyber Grid Pattern inside Card */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[2.5rem]" 
             style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        </div>

        {/* Decorative Top Dash */}
        <div className="w-12 h-1.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full mb-8 shadow-[0_0_15px_rgba(217,70,239,0.5)] mx-auto"></div>

        <div className="text-center mb-10 w-full relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3 drop-shadow-lg">
            Host a New <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">Mission</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-medium">Broadcast your opportunity to the cyberpunk network.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EVENT TYPE SELECT */}
            <div className="flex flex-col gap-1.5 group/input">
              <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 drop-shadow-md group-focus-within/input:text-fuchsia-400 transition-colors">
                Event Type
              </label>
              <div className="relative">
                <select 
                  className="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 outline-none transition-all duration-300 shadow-inner appearance-none cursor-pointer"
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                >
                  <option value="Hackathon" className="bg-[#0B0D17] text-white">Hackathon</option>
                  <option value="Quiz" className="bg-[#0B0D17] text-white">Online Quiz</option>
                  <option value="Exam" className="bg-[#0B0D17] text-white">Written Exam</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-cyan-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* ENTRY FEE INPUT */}
            <div className="flex flex-col gap-1.5 group/input">
              <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 drop-shadow-md group-focus-within/input:text-fuchsia-400 transition-colors">
                Entry Fee (₹)
              </label>
              <input 
                type="number" 
                min="0"
                required
                className="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 outline-none transition-all duration-300 shadow-inner font-mono text-lg"
                value={formData.fee}
                onChange={(e) => setFormData({...formData, fee: e.target.value})}
              />
            </div>
          </div>

          {/* EVENT TITLE INPUT */}
          <div className="flex flex-col gap-1.5 group/input">
            <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 drop-shadow-md group-focus-within/input:text-fuchsia-400 transition-colors">
              Event Title
            </label>
            <input 
              type="text" 
              placeholder="e.g. Nexus Connect 2026" 
              required
              className="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 outline-none transition-all duration-300 shadow-inner text-lg font-bold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          {/* DESCRIPTION TEXTAREA */}
          <div className="flex flex-col gap-1.5 group/input">
            <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 drop-shadow-md group-focus-within/input:text-fuchsia-400 transition-colors">
              Description
            </label>
            <textarea 
              placeholder="Describe the mission parameters..."
              required
              rows={4}
              className="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 outline-none transition-all duration-300 shadow-inner resize-y leading-relaxed"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DATE INPUT */}
            <div className="flex flex-col gap-1.5 group/input">
              <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 drop-shadow-md group-focus-within/input:text-fuchsia-400 transition-colors">
                Date
              </label>
              <input 
                type="date" 
                required
                className="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 outline-none transition-all duration-300 shadow-inner font-mono [color-scheme:dark]"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            
            {/* LOCATION INPUT */}
            <div className="flex flex-col gap-1.5 group/input">
              <label className="text-[10px] font-black text-cyan-400 tracking-widest uppercase ml-1 drop-shadow-md group-focus-within/input:text-fuchsia-400 transition-colors">
                Location
              </label>
              <input 
                type="text" 
                placeholder="Virtual or Venue"
                required
                className="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 outline-none transition-all duration-300 shadow-inner"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="relative group/btn w-full mt-6">
            {/* Glowing background for button on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-70 group-hover/btn:duration-200 transition duration-500"></div>
            
            <button 
              type="submit" 
              className="relative w-full py-4 bg-[#0B0D17] backdrop-blur-md text-white font-black uppercase tracking-widest text-sm rounded-2xl border border-white/10 hover:border-white/20 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(217,70,239,0.15)] overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
              
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping absolute ml-[-15px]"></span>
                <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                Broadcast Mission
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathon;
