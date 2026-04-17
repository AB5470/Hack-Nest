import { useEffect, useState } from 'react';
import { db } from '../../firebase'; 
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import JoinEvent from '../students/JoinEvent';
import Swal from 'sweetalert2';

const HackathonList = ({ role }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 🗑️ ANIMATED DELETE LOGIC ---
  const handleDelete = async (eventId, eventTitle) => {
    const result = await Swal.fire({
      title: 'Delete Mission?',
      text: `Are you willing to delete "${eventTitle}" forever? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e', // Vibrant Rose
      cancelButtonColor: '#334155',  // Slate 700
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
      background: '#0f172a', // Deep slate for dark mode
      color: '#f8fafc',
      customClass: {
        popup: 'rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-xl bg-slate-900/95',
        confirmButton: 'rounded-xl font-bold px-6 py-3 shadow-lg shadow-rose-500/30 hover:scale-105 transition-all',
        cancelButton: 'rounded-xl font-bold px-6 py-3 text-slate-300 hover:bg-slate-800 hover:scale-105 transition-all'
      },
      showClass: { popup: 'animate__animated animate__zoomIn animate__faster' },
      hideClass: { popup: 'animate__animated animate__zoomOut animate__faster' }
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "hackathons", eventId));
        Swal.fire({
          title: 'Deleted Successfully!',
          text: 'Mission data cleared.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#10b981', // Emerald 500
          customClass: {
            popup: 'rounded-[2rem] shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/20'
          }
        });
      } catch (error) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Error!', 
          text: error.message, 
          background: '#0f172a', 
          color: '#f8fafc',
          customClass: { popup: 'rounded-[2rem] border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.2)]' }
        });
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, "hackathons"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full">
        <div className="relative flex items-center justify-center w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-fuchsia-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-cyan-500 rounded-full border-b-transparent animate-spin reverse"></div>
        </div>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-black tracking-[0.3em] uppercase text-sm animate-pulse">Syncing Cyber Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 pb-32 font-sans relative">
      
      {/* Background Ambient Glows for the Page */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      {/* Vibrant Header Section */}
      <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 capitalize drop-shadow-lg">
            Cyber <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">Missions</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium">
            Lock in and build the future. Exclusive hackathons, vibrant networks, and massive bounties await.
          </p>
        </div>
        <div className="hidden md:block h-2 w-32 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse"></div>
      </div>

      {/* Grid for Cards */}
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="group relative w-full rounded-[2.5rem]">
              
              {/* Vibrant Glowing Aura effect behind the card */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-cyan-500 rounded-[2.5rem] opacity-30 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:duration-200"></div>
              
              {/* Main Card Container */}
              <div className="relative h-full z-10 bg-[#0B0D17]/95 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white/20">
                
                {/* Subtle Inner Highlight */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

                {/* Cyber Grid Pattern Background inside Card */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>

                {/* Admin Delete Button */}
                {role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(event.id, event.title)}
                    className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center bg-black/40 backdrop-blur-md text-white/50 hover:text-white hover:bg-rose-600 rounded-2xl border border-white/10 hover:border-rose-500 shadow-xl transition-all duration-300 z-20 active:scale-90"
                    aria-label="Delete Event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                <div className="p-8 sm:p-10 flex-1 flex flex-col relative z-10">
                  {/* Category & Fee */}
                  <div className="flex justify-between items-start mb-8">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
                      <span className="w-2 h-2 rounded-full bg-fuchsia-400 mr-2 animate-pulse shadow-[0_0_10px_rgba(232,121,249,0.8)]"></span>
                      {event.eventType || 'PREMIUM'}
                    </span>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Entry Fee</span>
                      <span className={`text-2xl font-black tracking-tighter drop-shadow-md ${event.fee > 0 ? 'text-cyan-400 shadow-cyan-400/20' : 'text-emerald-400 font-headline'}`}>
                        {event.fee > 0 ? `₹${event.fee}` : 'FREE'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-black text-white leading-tight mb-5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-fuchsia-300 group-hover:to-cyan-300 transition-all duration-500 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 flex-1 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Details (Venue/Date) */}
                  <div className="space-y-5 mb-10 pt-6 border-t border-white/5">
                    <div className="flex items-center text-slate-300 group/item">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mr-5 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover/item:scale-110 group-hover/item:bg-cyan-500/20 group-hover/item:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Venue</p>
                        <p className="text-sm font-bold truncate w-[180px] sm:w-[200px] text-slate-200">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-slate-300 group/item">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 mr-5 text-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.1)] group-hover/item:scale-110 group-hover/item:bg-fuchsia-500/20 group-hover/item:shadow-[0_0_25px_rgba(232,121,249,0.3)] transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm font-bold text-slate-200">{event.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="flex gap-4 justify-between items-center mt-auto">
                    {role !== 'admin' ? (
                      <div className="flex-1">
                        {/* Interactive dynamic Join Button wrapper */}
                        <div className="relative group/btn w-full">
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-70 transition duration-300"></div>
                          <div className="relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl">
                            <JoinEvent event={event} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-xs font-black text-cyan-300 uppercase tracking-widest flex items-center justify-center py-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 mr-3 animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
                        Admin Control
                      </div>
                    )}
                    
                    <button 
                      className="w-14 h-14 flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] focus:outline-none active:scale-95 z-20"
                      title="Bookmark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-32 px-4 bg-[#0B0D17]/50 backdrop-blur-xl rounded-[3rem] border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10 flex items-center justify-center text-white/20 group-hover:text-cyan-400/50 group-hover:border-cyan-500/20 transition-all duration-700 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight relative z-10">No Active Missions</h3>
            <p className="text-slate-400 text-sm max-w-sm text-center font-medium relative z-10">Incoming transmissions are empty. Check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonList;
