import React from 'react';

const StudentIDCard = ({ data, title = "Student Master ID" }) => {
  if (!data) return null;

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-950 shadow-[0_20px_60px_-15px_rgba(30,58,138,0.5)] group transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(30,58,138,0.7)] hover:-translate-y-1 my-6 cursor-default border border-white/10 flex flex-col">
      {/* Dynamic light reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0 pointer-events-none" />
      
      {/* Header section */}
      <div className="relative px-6 pt-5 pb-3 z-10 flex justify-between items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-md border-b border-white/10 -z-10" />
        <div className="text-left">
           <h2 className="text-white text-xl font-bold tracking-tight leading-tight">
             {title} {data.fullName ? `• ${data.fullName.split(' ')[0]}` : ''}
           </h2>
           <p className="text-indigo-200/80 text-[10px] font-semibold uppercase tracking-widest mt-1">
             Event Hub India
           </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center p-[2px] shadow-lg shadow-blue-500/30 flex-shrink-0">
          <div className="w-full h-full bg-indigo-950/80 rounded-[10px] flex items-center justify-center backdrop-blur-md text-2xl">
            🎓
          </div>
        </div>
      </div>
      
      {/* Body section */}
      <div className="relative flex-1 z-10 px-5 pb-5 mt-4 flex flex-col">
        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative overflow-hidden flex-1 flex flex-col justify-between">
          {/* Abstract pattern in body background */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-70" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-50 rounded-full blur-2xl opacity-70" />
          
          <div className="relative z-10 mb-2">
            <h3 className="text-slate-800 font-black text-2xl leading-tight tracking-tight">
               {data.fullName || 'Member Name'}
            </h3>
          </div>

          <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border border-slate-100 rounded-xl py-3 px-4 flex justify-between items-center relative z-10 shadow-sm mt-auto mb-4">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                Unique Identification
              </p>
              <p className="text-indigo-700 font-black text-xl tracking-[0.1em] font-mono">
                {data.uniqueId || data.studentID || '----'}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[9px] bg-emerald-100/60 px-2 py-1.5 rounded-md uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active
            </span>
          </div>
          
          <div className="relative z-10 flex items-end justify-between border-t border-slate-100 pt-3">
            {data.college ? (
              <div className="overflow-hidden pr-2 flex-1">
                <span className="block text-slate-400 font-medium text-[9px] uppercase tracking-wider mb-0.5">Institution</span>
                <span className="text-slate-700 font-bold text-xs truncate block max-w-[180px]">{data.college}</span>
              </div>
            ) : (
              <div />
            )}
            {/* Barcode representation */}
            <div className="w-28 h-8 opacity-60 mix-blend-multiply flex-shrink-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #1e293b, #1e293b 2px, transparent 2px, transparent 4px, #1e293b 4px, #1e293b 5px, transparent 5px, transparent 8px)' }}></div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 pb-4 text-center">
        <p className="text-indigo-200/60 text-[9px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
           <span>Valid for Check-in</span>
           <span className="w-1 h-1 bg-indigo-400/50 rounded-full"></span>
           <span>Non-Transferable</span>
        </p>
      </div>
    </div>
  );
};

export default StudentIDCard;