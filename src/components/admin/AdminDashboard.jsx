import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, doc, where, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('All');
  const [loading, setLoading] = useState(true);

  // --- 🛠️ ARCHIVE LOGIC (With Premium Animations) ---
  const handleRemoveRegistration = async (regId, studentName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Archieve the data of ${studentName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Red
      cancelButtonColor: '#6366f1',  // Indigo
      confirmButtonText: 'Yes, Archive!',
      background: '#111827',
      color: '#fff',
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    if (result.isConfirmed) {
      // Show loading till DB get updated.
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
    const matchesEvent = filterEvent === 'All' || reg.eventTitle === filterEvent;
    return matchesSearch && matchesEvent;
  });

  const eventTypes = ['All', ...new Set(registrations.map(reg => reg.eventTitle))];

  return (
    <div className="animate-slide-in-top p-6 md:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] mt-8 border border-white/10 relative overflow-hidden">
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
            className="px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm cursor-pointer"
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
                <th className="px-6 py-5">Unique ID</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((reg, index) => (
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
                  <td className="px-6 py-4 font-mono text-sm text-indigo-300">{reg.studentUniqueId}</td>
                  <td className="px-6 py-4 text-xs text-indigo-200/50">
                    {reg.enrolledAt?.toDate ? reg.enrolledAt.toDate().toLocaleDateString('en-IN') : 'N/A'}
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
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="text-center py-20 opacity-40 text-xs uppercase tracking-widest">No matching records</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;