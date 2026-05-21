import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, doc, where, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('All');
  const [loading, setLoading] = useState(true);

  // --- ⚙️ NEW: GATEKEEPER STATES (Quiz Settings) ---
  const [minMarks, setMinMarks] = useState(60);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // --- 📡 FETCH GLOBAL QUIZ SETTINGS FROM FIREBASE ON MOUNT ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsRef = doc(db, "quizSettings", "config");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setMinMarks(settingsSnap.data().minQualifyingMarks || 60);
        }
      } catch (error) {
        console.error("Error fetching quiz settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // --- 💾 SAVE GLOBAL QUIZ SETTINGS TO FIREBASE ---
  const handleUpdateCriteria = async (e) => {
    e.preventDefault();
    setUpdatingSettings(true);
    try {
      const settingsRef = doc(db, "quizSettings", "config");
      await setDoc(settingsRef, { minQualifyingMarks: Number(minMarks) }, { merge: true });
      
      Swal.fire({
        title: 'Gatekeeper Updated!',
        text: `Minimum qualifying score locked at ${minMarks}%`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#111827',
        color: '#fff'
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to write criteria to database',
        background: '#111827',
        color: '#fff'
      });
    } finally {
      setUpdatingSettings(false);
    }
  };

  // --- 🛠️ ARCHIVE LOGIC (With Premium Animations) ---
  const handleRemoveRegistration = async (regId, studentName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Archive the data of ${studentName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#6366f1',  
      confirmButtonText: 'Yes, Archive!',
      background: '#111827',
      color: '#fff',
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Archiving...',
        allowOutsideClick: false,
        background: '#111827',
        color: '#fff',
        didOpen: () => { Swal.showLoading(); }
      });

      try {
        const regRef = doc(db, "registrations", regId);
        await updateDoc(regRef, { status: 'archived' });

        Swal.fire({
          title: 'Archived!',
          text: 'Student removed from active list.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff'
        });
      } catch (error) {
        console.error("Archive Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Update failed',
          background: '#111827',
          color: '#fff'
        });
      }
    }
  };

  // --- 📡 REAL-TIME DATA FETCH ---
  useEffect(() => {
    const regRef = collection(db, "registrations");
    const q = query(
      regRef, 
      where("status", "!=", "archived"), 
      orderBy("status"), 
      orderBy("enrolledAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setRegistrations(data);
      setLoading(false);
    }, (error) => {
      console.error("Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 🔍 FILTER LOGIC ---
  const filteredData = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = reg.studentName?.toLowerCase().includes(searchLower);
    const idMatch = reg.studentUniqueId?.toLowerCase().includes(searchLower);
    const matchesSearch = nameMatch || idMatch;
    
    // Support filtering by Event Type or Quick Filters (Qualified/All)
    if (filterEvent === 'All') return matchesSearch;
    if (filterEvent === 'Shortlisted (Qualified)') {
      const score = Number(reg.quizScore || 0);
      return matchesSearch && score >= minMarks;
    }
    const matchesEvent = reg.eventTitle === filterEvent;
    return matchesSearch && matchesEvent;
  });

  // Base categories dropdown structure
  const eventTypes = ['All', 'Shortlisted (Qualified)', ...new Set(registrations.map(reg => reg.eventTitle))];

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* ─── NEW STEP: GATEKEEPER CRITERIA PANEL ─── */}
      <div className="animate-slide-in-top p-6 bg-gradient-to-r from-slate-900 via-[#0d1527] to-slate-900 rounded-2xl border border-blue-500/20 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-white text-md font-bold font-mono tracking-wider text-[#00e8ff] uppercase flex items-center gap-2">
              <span>⚙️</span> Screening Round Gatekeeper
            </h3>
            <p className="text-xs text-indigo-200/60 mt-0.5">
              Set cutoff parameters. System auto-locks the Hackathon Phase for scores below this index.
            </p>
          </div>
          <form onSubmit={handleUpdateCriteria} className="flex flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5">
              <label className="text-[11px] font-mono tracking-wider text-gray-400 uppercase">Min Cutoff (%):</label>
              <input 
                type="number" 
                value={minMarks}
                onChange={(e) => setMinMarks(e.target.value)}
                className="w-16 bg-transparent text-center font-mono font-bold text-[#00e8ff] focus:outline-none"
                min="0" max="100" required
              />
            </div>
            <button
              type="submit"
              disabled={updatingSettings}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95"
            >
              {updatingSettings ? "Saving..." : "Lock Criteria"}
            </button>
          </form>
        </div>
      </div>

      {/* ─── LIVE DATA ENGINE TABLE ─── */}
      <div className="animate-slide-in-top p-6 md:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center mb-8 gap-5 border-b border-white/5 pb-6">
          <div>
             <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
                Live Registrations <span className="text-blue-400">({filteredData.length})</span>
             </h2>
             <p className="text-indigo-200/70 text-xs md:text-sm font-medium uppercase tracking-widest">
               Operations Control Center
             </p>
          </div>
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Search Name or ID..." 
              className="pl-4 pr-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-full sm:w-64 text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              onChange={(e) => setFilterEvent(e.target.value)}
              className="px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm cursor-pointer font-mono"
            >
              {eventTypes.map(type => <option key={type} value={type} className="bg-slate-900">{type}</option>)}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-200 text-xs tracking-widest animate-pulse">SYNCING DATABASE...</p>
          </div>
        ) : (
          <div className="relative z-10 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white/5 text-indigo-200/60 text-[10px] uppercase tracking-widest border-b border-white/10">
                <tr>
                  <th className="px-6 py-5">Participant</th>
                  <th className="px-6 py-5">Event</th>
                  <th className="px-6 py-5">Quiz Score</th>
                  <th className="px-6 py-5">Pipeline Status</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((reg, index) => {
                  // Core score parsing evaluation logic 
                  const currentScore = Number(reg.quizScore || 0);
                  const isQualified = currentScore >= Number(minMarks);

                  return (
                    <tr key={reg.id} className="transition-all hover:bg-white/5 group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-[15px] group-hover:text-blue-400 transition-colors">{reg.studentName}</div>
                        <div className="text-[10px] text-indigo-300/50 uppercase font-medium">{reg.college}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-lg text-[11px] font-bold">
                          {reg.eventTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {reg.quizScore !== undefined ? (
                          <span className={isQualified ? "text-emerald-400 font-bold" : "text-amber-500"}>
                            {reg.quizScore}%
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs italic">Not Attempted</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {reg.quizScore !== undefined ? (
                          isQualified ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider">
                              ✓ QUALIFIED // ARENA OPEN
                            </span>
                          ) : (
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider">
                              ✕ FAILED // LOCKED
                            </span>
                          )
                        ) : (
                          <span className="bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider">
                            WAITING FOR ATTEMPT
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleRemoveRegistration(reg.id, reg.studentName)}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95"
                        >
                          Archive
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="text-center py-20 opacity-40 text-xs uppercase tracking-widest">No matching records</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;