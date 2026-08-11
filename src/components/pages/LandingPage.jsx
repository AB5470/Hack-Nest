import React, { useEffect, useRef, useState } from 'react';

const NAV_LINKS = ['HOME', 'QUIZ', 'CONTACT'];

const CODE_SNIPPETS = [
  `function solve(n) {\n  if (n <= 1) return n;\n  return solve(n-1)\n    + solve(n-2);\n}`,
  `const dp = Array(n)\n  .fill(0)\n  .map(() =>\n    Array(n).fill(Infinity));\ndp[src][src] = 0;`,
  `class Graph {\n  bfs(start) {\n    const q = [start];\n    while (q.length) {\n      let v = q.shift();\n    }\n  }\n}`,
  `SELECT u.name,\n  COUNT(s.id) AS score\nFROM users u\nJOIN submissions s\n  ON u.id = s.user_id\nGROUP BY u.id;`,
  `@app.route('/submit')\ndef submit():\n  token = verify_jwt(\n    request.headers)\n  return grade(token)`,
];

export default function LandingPage({ onSignInClick }) {
  const canvasRef = useRef(null);
  const [glitch, setGlitch] = useState(false);

  // Guest Admin Handler
  const handleGuestAdminLogin = () => {
    const guestUser = {
      uid: 'demo-admin-guest',
      email: 'guest.admin@hacknest.com',
      role: 'admin',
      isGuest: true,
    };
    localStorage.setItem('user', JSON.stringify(guestUser));
    
    // Yahan apna actual Admin Dashboard route daalein (e.g., /admin/dashboard ya /admin)
    window.location.href = '/admin/dashboard';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const COUNT = 85;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,220,240,0.55)'; ctx.fill();
      });
      for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,220,240,${0.18 * (1 - d / 150)})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 120); }, 4500);
    return () => clearInterval(t);
  }, []);

  const S = {
    root: {
      minHeight: '100vh', width: '100%',
      background: 'linear-gradient(160deg,#020c1b 0%,#030f1e 55%,#050a14 100%)',
      color: '#e0f7ff',
      fontFamily: "'Rajdhani','Orbitron','Share Tech Mono',sans-serif",
      position: 'relative', overflowX: 'hidden',
      margin: 0, padding: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
    },
    canvas: { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh' },
    grid: {
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundImage: 'linear-gradient(rgba(0,220,240,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,220,240,0.04) 1px,transparent 1px)',
      backgroundSize: '56px 56px', width: '100vw', height: '100vh',
    },
    glowL: { position: 'fixed', top: '5%', left: '-15%', width: 'clamp(400px,50vw,800px)', height: 'clamp(400px,50vw,800px)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,230,255,0.10) 0%,transparent 70%)', filter: 'blur(65px)', pointerEvents: 'none', zIndex: 0 },
    glowR: { position: 'fixed', bottom: '0%', right: '-10%', width: 'clamp(500px,60vw,900px)', height: 'clamp(500px,60vw,900px)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,60,255,0.09) 0%,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 },
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 65, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 5vw', background: 'rgba(2,12,27,0.75)', backdropFilter: 'blur(22px)',
      borderBottom: '1px solid rgba(0,220,240,0.14)',
    },
    navLogo: { fontFamily: "'Orbitron',monospace", fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.14em', color: '#e0f7ff', textShadow: '0 0 18px rgba(0,240,255,0.5)' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 'clamp(0.8rem,1.8vw,2.2rem)', listStyle: 'none' },
    navLink: { fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.18em', color: 'rgba(180,230,245,0.65)', textDecoration: 'none', textTransform: 'uppercase', cursor: 'pointer', transition: 'color .2s' },
    joinBtn: { fontFamily: "'Orbitron',monospace", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00e8ff', background: 'transparent', border: '1px solid rgba(0,232,255,0.55)', padding: '0.5rem 1.4rem', cursor: 'pointer', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', transition: 'background .25s,box-shadow .25s' },
    demoBtn: { fontFamily: "'Orbitron',monospace", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a78bfa', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.6)', padding: '0.5rem 1.2rem', cursor: 'pointer', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', boxShadow: '0 0 12px rgba(167,139,250,0.2)', transition: 'all .25s ease' },
    avatar: { width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(0,220,240,0.5)', background: 'rgba(0,220,240,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: '0.9rem', color: '#00e8ff' },
    hero: {
      position: 'relative', zIndex: 5, width: '100%', maxWidth: '1200px',
      margin: '0 auto', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '140px 2rem 60px', boxSizing: 'border-box', textAlign: 'center',
    },
    badge: { fontFamily: "'Share Tech Mono',monospace", fontSize: '0.8rem', letterSpacing: '0.22em', color: '#00e8ff', border: '1px solid rgba(0,232,255,0.28)', padding: '6px 20px', borderRadius: 3, background: 'rgba(0,220,240,0.06)', boxShadow: '0 0 14px rgba(0,220,240,0.14)', marginBottom: '1.8rem', textTransform: 'uppercase' },
    h1Brand: { fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 'clamp(2.8rem,7vw,5.2rem)', letterSpacing: '0.08em', color: '#e8f8ff', textShadow: glitch ? '3px 0 #ff003c,-3px 0 #00fff7,0 0 28px rgba(0,240,255,0.6)' : '0 0 28px rgba(0,240,255,0.45)', lineHeight: 1.05, transition: 'text-shadow .05s' },
    h1Sub: { fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 'clamp(1.1rem,2.8vw,2.1rem)', letterSpacing: '0.04em', background: 'linear-gradient(90deg,#00e8ff 0%,#60a5fa 50%,#a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2, marginTop: '0.8rem' },
    subText: { fontFamily: "'Rajdhani',sans-serif", fontWeight: 400, fontSize: 'clamp(1rem,1.5vw,1.2rem)', color: 'rgba(160,215,235,0.6)', maxWidth: '750px', lineHeight: 1.65, margin: '1.6rem auto 2.5rem', textAlign: 'center' },
    pills: { display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', width: '100%' },
    pill: { display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(160,240,255,0.8)' },
    pillDot: { width: 8, height: 8, borderRadius: '50%', background: '#00e8ff', boxShadow: '0 0 8px #00e8ff' },
    cta: { fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00e8ff', background: 'transparent', border: '1.5px solid rgba(0,232,255,0.7)', padding: '1.1rem 3.5rem', cursor: 'pointer', clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)', boxShadow: '0 0 22px rgba(0,220,240,0.22),inset 0 0 12px rgba(0,220,240,0.08)', transition: 'background .3s,box-shadow .3s,transform .2s', marginBottom: '5rem' },
    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem', width: '100%', padding: '0 1rem', boxSizing: 'border-box' },
    featureCard: { background: 'rgba(8,20,38,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '2rem 1.8rem', transition: 'border-color .25s,box-shadow .25s,transform .25s', cursor: 'default' },
    featureTitle: { fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.8rem' },
    featureBody: { fontFamily: "'Rajdhani',sans-serif", fontWeight: 400, fontSize: '1rem', color: 'rgba(140,200,220,0.6)', lineHeight: 1.6 },
    scanLine: { position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(0,240,255,0.35),transparent)', animation: 'scanMove 6s linear infinite', pointerEvents: 'none' },
    footer: { position: 'relative', zIndex: 5, display: 'flex', justifyContent: 'center', gap: '3rem', padding: '1.8rem 2rem', borderTop: '1px solid rgba(0,220,240,0.08)', fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.18em', color: 'rgba(120,180,200,0.45)', textTransform: 'uppercase', width: '100%', boxSizing: 'border-box' },
  };

  const features = [
    { icon: '📈', color: '#00e8ff', title: 'Real-Time Telemetry', body: 'Instantaneous score evaluation feeding live cryptographic leaderboards with sub-second latency.' },
    { icon: '🛡️', color: '#60a5fa', title: 'Proctored Compliance', body: 'Smart tab-state monitoring and active anti-compromise triggers ensuring full match integrity.' },
    { icon: '👥', color: '#a78bfa', title: 'Matrix Clusters', body: 'Granular role-based environment allocation for fluid developer synergy and team synchronization.' },
  ];

  const hoverCard = (e, on, color) => {
    e.currentTarget.style.borderColor = on ? color : 'rgba(255,255,255,0.06)';
    e.currentTarget.style.boxShadow = on ? `0 0 28px ${color}28` : 'none';
    e.currentTarget.style.transform = on ? 'translateY(-4px)' : 'translateY(0)';
  };

  const panelBase = {
    position: 'fixed', zIndex: 2, pointerEvents: 'none',
    background: 'rgba(4,18,36,0.55)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0,220,240,0.18)',
    borderRadius: 8,
  };

  const bars = [55, 80, 45, 92, 68, 75, 38, 88];
  const barColors = ['#00e8ff', '#60a5fa', '#00e8ff', '#a78bfa', '#60a5fa', '#00e8ff', '#a78bfa', '#00e8ff'];

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');
        @keyframes scanMove { 0%{top:-2px} 100%{top:100%} }
        @keyframes floatA  { 0%,100%{transform:translateY(0px) rotate(-6deg)} 50%{transform:translateY(-14px) rotate(-6deg)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0px) rotate(5deg)}  50%{transform:translateY(-10px) rotate(5deg)} }
        @keyframes floatC  { 0%,100%{transform:translateY(0px) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(-3deg)} }
        @keyframes floatD  { 0%,100%{transform:translateY(0px) rotate(8deg)}  50%{transform:translateY(-8px)  rotate(8deg)} }
        @keyframes floatE  { 0%,100%{transform:translateY(0px) rotate(-5deg)} 50%{transform:translateY(-12px) rotate(-5deg)} }
        @keyframes barRise { 0%{height:0} 100%{height:var(--h)} }
        @keyframes codeScroll { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        @keyframes pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes teamPulse { 0%,100%{box-shadow:0 0 12px rgba(167,139,250,0.3)} 50%{box-shadow:0 0 28px rgba(167,139,250,0.7)} }
        @keyframes bigLetterGlow { 0%,100%{text-shadow:0 0 30px rgba(0,232,255,0.4),0 0 60px rgba(0,232,255,0.15)} 50%{text-shadow:0 0 50px rgba(0,232,255,0.7),0 0 100px rgba(0,232,255,0.3)} }
        @keyframes bigLetterGlow2 { 0%,100%{text-shadow:0 0 30px rgba(167,139,250,0.4),0 0 60px rgba(167,139,250,0.15)} 50%{text-shadow:0 0 50px rgba(167,139,250,0.7),0 0 100px rgba(167,139,250,0.3)} }
        html, body, #root { margin:0!important; padding:0!important; width:100%!important; height:100%!important; background-color:#020c1b; overflow-x:hidden!important; }
        * { box-sizing:border-box; }
      `}</style>

      <canvas ref={canvasRef} style={S.canvas} />
      <div style={S.grid} />
      <div style={S.glowL} />
      <div style={S.glowR} />

      {/* FLOATING ELEMENTS */}
      <div style={{ position: 'fixed', top: '8%', right: '4%', zIndex: 2, pointerEvents: 'none',
        fontFamily: "'Orbitron',monospace", fontWeight: 900,
        fontSize: 'clamp(80px,10vw,140px)', color: 'transparent',
        WebkitTextStroke: '2px rgba(0,232,255,0.55)',
        animation: 'floatA 5s ease-in-out infinite, bigLetterGlow 3s ease-in-out infinite',
        opacity: 0.75, letterSpacing: '-0.05em', userSelect: 'none',
      }}>A</div>

      <div style={{ position: 'fixed', top: '42%', left: '2.5%', zIndex: 2, pointerEvents: 'none',
        fontFamily: "'Orbitron',monospace", fontWeight: 900,
        fontSize: 'clamp(50px,6vw,90px)', color: 'transparent',
        WebkitTextStroke: '1.5px rgba(167,139,250,0.5)',
        animation: 'floatB 7s ease-in-out infinite, bigLetterGlow2 4s ease-in-out infinite',
        opacity: 0.6, userSelect: 'none',
      }}>A</div>

      {[
        { ch: 'λ', top: '14%', left: '6%', sz: 38, color: 'rgba(0,232,255,0.35)', anim: 'floatC 6s ease-in-out infinite' },
        { ch: 'Σ', top: '70%', right: '6%', sz: 42, color: 'rgba(96,165,250,0.35)', anim: 'floatD 8s ease-in-out infinite' },
        { ch: '∇', top: '80%', left: '8%', sz: 34, color: 'rgba(167,139,250,0.35)', anim: 'floatE 5.5s ease-in-out infinite' },
        { ch: 'Ω', top: '22%', right: '12%', sz: 30, color: 'rgba(0,232,255,0.28)', anim: 'floatA 9s ease-in-out infinite' },
      ].map(({ ch, top, left, right, sz, color, anim }) => (
        <div key={ch + top} style={{
          position: 'fixed', top, left, right, zIndex: 2, pointerEvents: 'none',
          fontFamily: "'Orbitron',monospace", fontWeight: 700,
          fontSize: sz, color, animation: anim, userSelect: 'none',
          textShadow: `0 0 20px ${color}`,
        }}>{ch}</div>
      ))}

      {/* Code Snippets & Visual Panels */}
      <div style={{ ...panelBase, top: '18%', left: '1.5%', width: 220, padding: '14px 16px', animation: 'floatC 7s ease-in-out infinite' }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', color: 'rgba(0,220,240,0.4)', letterSpacing: '0.15em', marginBottom: 8 }}>// ALGO_ENGINE</div>
        <pre style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', color: 'rgba(0,220,240,0.75)', lineHeight: 1.7, whiteSpace: 'pre', margin: 0, overflow: 'hidden' }}>{CODE_SNIPPETS[0]}</pre>
        <div style={{ marginTop: 10, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,220,240,0.3),transparent)' }} />
      </div>

      <div style={{ ...panelBase, top: '28%', right: '1.5%', width: 215, padding: '14px 16px', animation: 'floatB 8s ease-in-out infinite' }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', color: 'rgba(96,165,250,0.5)', letterSpacing: '0.15em', marginBottom: 8 }}>// GRAPH_BFS</div>
        <pre style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', color: 'rgba(96,165,250,0.75)', lineHeight: 1.7, whiteSpace: 'pre', margin: 0 }}>{CODE_SNIPPETS[2]}</pre>
      </div>

      <div style={{ ...panelBase, bottom: '14%', left: '1.5%', width: 200, padding: '12px 14px', animation: 'floatE 9s ease-in-out infinite' }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem', color: 'rgba(167,139,250,0.45)', letterSpacing: '0.12em', marginBottom: 6 }}>// DB_QUERY</div>
        <pre style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem', color: 'rgba(167,139,250,0.7)', lineHeight: 1.65, whiteSpace: 'pre', margin: 0 }}>{CODE_SNIPPETS[3]}</pre>
      </div>

      <div style={{ ...panelBase, bottom: '10%', right: '1.5%', width: 210, padding: '16px 18px', animation: 'floatD 6.5s ease-in-out infinite' }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem', color: 'rgba(0,220,240,0.45)', letterSpacing: '0.15em', marginBottom: 12 }}>// SCORE_TELEMETRY</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: '2px 2px 0 0',
              background: `linear-gradient(to top, ${barColors[i]}, ${barColors[i]}66)`,
              height: `${h}%`,
              boxShadow: `0 0 6px ${barColors[i]}88`,
              animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`,
            }} />
          ))}
        </div>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          {['R1','R2','R3','R4'].map(l => (
            <span key={l} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.5rem', color: 'rgba(0,220,240,0.4)' }}>{l}</span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={S.nav}>
        <span style={S.navLogo}>HACK_NEST</span>
        <ul style={S.navLinks}>
          {NAV_LINKS.map(l => (
            <li key={l}>
              <a style={S.navLink} href="#"
                onMouseOver={e => { e.target.style.color = '#00e8ff'; e.target.style.textShadow = '0 0 10px #00e8ff'; }}
                onMouseOut={e => { e.target.style.color = 'rgba(180,230,245,0.65)'; e.target.style.textShadow = 'none'; }}
              >{l}</a>
            </li>
          ))}
          <li>
            <button style={S.joinBtn}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,232,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,220,240,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >JOIN A TEAM</button>
          </li>
          
          {/* NEW: Demo Admin Button */}
          <li>
            <button 
              onClick={handleGuestAdminLogin}
              style={S.demoBtn}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(167, 139, 250, 0.22)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(167, 139, 250, 0.5)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(167, 139, 250, 0.08)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(167, 139, 250, 0.2)';
              }}
            >
              👁️ DEMO ADMIN
            </button>
          </li>

          <li><div style={S.avatar}>A</div></li>
        </ul>
      </nav>

      {/* HERO */}
      <main style={S.hero}>
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={S.scanLine} />
        </div>

        <div style={S.badge}>// CORE SYSTEM_STATUS: READY</div>

        <div style={{ marginBottom: '1.2rem', width: '100%', textAlign: 'center' }}>
          <div style={S.h1Brand}>HACK_NEST</div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.98rem', letterSpacing: '0.28em', color: 'rgba(0,220,240,0.55)', margin: '0.5rem 0 0.8rem', textTransform: 'uppercase' }}>
            INITIATE YOUR CODE_LEGACY
          </div>
          <div style={S.h1Sub}>WHERE INNOVATORS CONNECT & CONQUER →</div>
        </div>

        <p style={S.subText}>
          An advanced decentralized hackathon environment with multi-layered secure AI proctoring, real-time grading telemetry, and dynamic role-based workspaces.
        </p>

        <div style={S.pills}>
          {['Real-Time Scoring', 'Proctored Exams', 'Team Formation'].map(label => (
            <div key={label} style={S.pill}>
              <div style={S.pillDot} /><span>{label}</span>
            </div>
          ))}
        </div>

        <button style={S.cta} onClick={onSignInClick}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,232,255,0.09)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,220,240,0.5),inset 0 0 18px rgba(0,220,240,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = '0 0 22px rgba(0,220,240,0.22),inset 0 0 12px rgba(0,220,240,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          ENTER HACK-NEST ⚡
        </button>

        <div style={S.featureGrid}>
          {features.map(({ icon, color, title, body }) => (
            <div key={title} style={S.featureCard}
              onMouseOver={e => hoverCard(e, true, color)}
              onMouseOut={e => hoverCard(e, false, color)}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{icon}</div>
              <div style={{ ...S.featureTitle, color }}>{title}</div>
              <p style={S.featureBody}>{body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={S.footer}>
        <span>ABOUT US</span>
        <span style={{ color: 'rgba(0,220,240,0.2)' }}>|</span>
        <span>FOOTER</span>
      </footer>
    </div>
  );
}