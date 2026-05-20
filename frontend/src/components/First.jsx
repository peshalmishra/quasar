import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Register from './Register';
import {
  Sparkles, Zap, FileText, Users, Share2,
  ArrowRight, Github, Twitter, Mail,
  CheckCircle2,
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Zap size={20} color="#a78bfa" />,
    title: 'Auto-Save',
    desc: 'Every keystroke saved instantly. Never lose a word again.',
  },
  {
    icon: <FileText size={20} color="#a78bfa" />,
    title: 'Export as PDF',
    desc: 'One-click export to high-quality, print-ready PDF.',
  },
  {
    icon: <Share2 size={20} color="#a78bfa" />,
    title: 'Shareable Links',
    desc: 'Generate secure read-only links to share documents effortlessly.',
  },
  {
    icon: <Users size={20} color="#a78bfa" />,
    title: 'Real-Time Collaboration',
    desc: 'Edit together with your team, live — no matter where they are.',
  },
];

const STEPS = [
  { emoji: '✏️', step: 'Step 1', title: 'Write', desc: 'Start typing with a smart editor supporting headings, lists, markdown and more.' },
  { emoji: '🤝', step: 'Step 2', title: 'Collaborate', desc: 'Invite others to edit in real time. No limits, no lag.' },
  { emoji: '📤', step: 'Step 3', title: 'Share', desc: 'Publish or export instantly — ready to use, share, or present anywhere.' },
];

export default function First() {
  const [show, setShow] = useState({ login: false, register: false });
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const projectId = localStorage.getItem('projectId');
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const showLogin = () => setShow({ login: !show.login, register: false });
  const showRegister = () => setShow({ register: !show.register, login: false });

  useEffect(() => {
    if (show.login || show.register) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  const handleGetStarted = () => {
    if (token && userId && projectId) navigate(`/showtask/${userId}/${projectId}`);
    else if (token && userId) navigate(`/showtask/${userId}`);
    else navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <div style={{ minHeight: '100vh', background: isDark ? '#0f0f11' : '#f8fafc', overflowX: 'hidden' }}>

        {/* ── Navbar ── */}
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'sticky', top: 0, zIndex: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 clamp(20px, 5vw, 80px)',
            height: 60,
            background: 'rgba(15,15,17,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px rgba(124,58,237,0.4)',
            }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.3px' }}>Quasar</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.97 }}
              onClick={showLogin}
              style={{
                padding: '8px 18px', borderRadius: 9,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#b4b4b8', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                transition: 'all 0.15s',
              }}
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={showRegister}
              style={{
                padding: '8px 18px', borderRadius: 9,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 0 14px rgba(124,58,237,0.3)',
                transition: 'box-shadow 0.2s',
              }}
            >
              Sign Up
            </motion.button>
          </div>
        </motion.nav>

        {/* ── Hero ── */}
        <section
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(60px,10vh,120px) clamp(20px,5vw,80px) clamp(60px,8vh,100px)',
            position: 'relative',
          }}
        >
          {/* Glow blob */}
          <div style={{
            position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 600,
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 20,
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              marginBottom: 28,
              fontSize: 12, fontWeight: 700, color: '#a78bfa',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            <Sparkles size={12} />
            Distraction-free writing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            style={{
              fontSize: 'clamp(40px, 7vw, 76px)',
              fontWeight: 900,
              color: isDark ? '#ffffff' : '#111827',
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              maxWidth: 760,
              marginBottom: 22,
            }}
          >
            Write.{' '}
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Collaborate.
            </span>
            {' '}Share.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: isDark ? '#9ca3af' : '#475569', lineHeight: 1.7,
              maxWidth: 520, marginBottom: 36,
            }}
          >
            A distraction-free, real-time text editor with auto-save, PDF export,
            and secure sharing — built for creators, students, and teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.4 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(124,58,237,0.55)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGetStarted}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', color: '#fff',
                fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 0 20px rgba(124,58,237,0.35)',
                transition: 'box-shadow 0.2s',
              }}
            >
              Get Started
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.97 }}
              onClick={showLogin}
              style={{
                padding: '14px 28px', borderRadius: 12,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.12)',
                color: isDark ? '#d1d5db' : '#475569', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                transition: 'all 0.15s',
              }}
            >
              Sign In
            </motion.button>
          </motion.div>
        </section>

        {/* ── Features ── */}
        <section style={{ padding: 'clamp(40px,8vh,80px) clamp(20px,5vw,80px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: isDark ? '#fff' : '#111827', letterSpacing: '-0.03em', marginBottom: 10 }}>
              Everything you need
            </h2>
            <p style={{ color: isDark ? '#9ca3af' : '#475569', fontSize: 16 }}>Powerful features in a beautifully simple package.</p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}
                style={{
                  background: isDark ? '#151518' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                  borderRadius: 16,
                  padding: '24px 22px',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#fff' : '#111827', marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#475569', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ padding: 'clamp(40px,8vh,80px) clamp(20px,5vw,80px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: isDark ? '#fff' : '#111827', letterSpacing: '-0.03em', marginBottom: 10 }}>
              How it works
            </h2>
            <p style={{ color: isDark ? '#9ca3af' : '#475569', fontSize: 16 }}>Three simple steps to get started.</p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            maxWidth: 780,
            margin: '0 auto',
          }}>
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{
                  background: isDark ? '#151518' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                  borderRadius: 16,
                  padding: '28px 22px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 6 }}>
                  {s.step}
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#fff' : '#111827', marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#475569', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: 'clamp(40px,8vh,80px) clamp(20px,5vw,80px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              maxWidth: 640, margin: '0 auto', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 24, padding: 'clamp(36px,6vh,60px) clamp(24px,5vw,60px)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: isDark ? '#fff' : '#111827', letterSpacing: '-0.03em', marginBottom: 12 }}>
              Ready to start writing?
            </h2>
            <p style={{ color: isDark ? '#9ca3af' : '#475569', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
              Join thousands of writers, students, and teams who trust Quasar to capture their best ideas.
            </p>
            {['Free forever', 'No credit card required', 'Cancel anytime'].map(item => (
              <div key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginRight: 18, marginBottom: 20, fontSize: 12, color: '#a78bfa' }}>
                <CheckCircle2 size={13} />
                {item}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(124,58,237,0.55)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px', borderRadius: 11,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                  boxShadow: '0 0 18px rgba(124,58,237,0.35)',
                }}
              >
                Get Started Free
                <ArrowRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.12)',
          padding: 'clamp(32px,5vh,60px) clamp(20px,5vw,80px)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 40, marginBottom: 40,
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={13} color="#fff" />
                </div>
                <span style={{ fontWeight: 800, fontSize: 16, color: isDark ? '#fff' : '#111827' }}>Quasar</span>
              </div>
              <p style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#475569', lineHeight: 1.6 }}>
                Write. Share. Collaborate.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Quick Links
              </h3>
              {[['Home', '/'], ['Login', '/login'], ['Sign Up', '/register']].map(([label, href]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: 14, color: isDark ? '#94a3b8' : '#475569', marginBottom: 8, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#a78bfa'}
                  onMouseLeave={e => e.target.style.color = '#52525b'}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Contact
              </h3>
              <p style={{ fontSize: 13, color: '#52525b', marginBottom: 6 }}>support@quasar.com</p>
              <p style={{ fontSize: 13, color: '#52525b' }}>+91 98765 43210</p>
            </div>

            {/* Social */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Follow Us
              </h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: <Github size={16} />, href: '#' },
                  { icon: <Twitter size={16} />, href: '#' },
                  { icon: <Mail size={16} />, href: '#' },
                ].map((s, i) => (
                  <motion.a
                    key={i} href={s.href}
                    whileHover={{ scale: 1.1, background: 'rgba(124,58,237,0.2)' }}
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#71717a', transition: 'all 0.15s',
                    }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 24, textAlign: 'center',
            fontSize: 13, color: '#3f3f46',
          }}>
            © {new Date().getFullYear()} Quasar. All rights reserved.
          </div>
        </footer>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {show.login && <Login handleShow={showLogin} />}
      </AnimatePresence>
      <AnimatePresence>
        {show.register && <Register handleShow={showRegister} />}
      </AnimatePresence>
    </>
  );
}