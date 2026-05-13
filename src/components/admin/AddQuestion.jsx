import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GenericButton from '../UI/GenericButton'; // Agar UI use karna hai

const AddQuestion = () => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correct) return alert("Bhai, sahi jawab toh choose kar lo!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "questions"), {
        text,
        options,
        correct,
        createdAt: serverTimestamp()
      });
      alert("Sawal Database mein save ho gaya! ✅");
      
      // Form reset
      setText('');
      setOptions(['', '', '', '']);
      setCorrect('');
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Kuch gadbad ho gayi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#0B0D17] min-h-screen text-white font-sans">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black mb-2 text-blue-500 uppercase tracking-tighter">Quiz Manager</h2>
        <p className="text-slate-500 mb-8 font-medium">Add new questions to the database without touching the code.</p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          {/* Question Text */}
          <div>
            <label className="block mb-2 text-xs font-black uppercase tracking-widest text-slate-400">Question Content</label>
            <textarea 
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all min-h-[100px]" 
              placeholder="e.g. What is the output of typeof null?"
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required
            />
          </div>
          
          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, i) => (
              <div key={i}>
                <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Option {i + 1}</label>
                <input 
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none" 
                  placeholder={`Choice ${i + 1}`}
                  value={opt} 
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }} 
                  required
                />
              </div>
            ))}
          </div>

          {/* Correct Answer Dropdown */}
          <div className="pt-4 border-t border-white/5">
            <label className="block mb-2 text-xs font-black uppercase tracking-widest text-emerald-400">Select Correct Answer</label>
            <select 
              className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-100 outline-none appearance-none cursor-pointer"
              value={correct} 
              onChange={(e) => setCorrect(e.target.value)} 
              required
            >
              <option value="" className="bg-[#0B0D17]">-- Click to Choose --</option>
              {options.map((opt, i) => (
                opt && <option key={i} value={opt} className="bg-[#0B0D17]">{opt}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all 
            ${loading ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'}`}
          >
            {loading ? 'Saving to Cloud...' : 'Add to Question Bank'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;