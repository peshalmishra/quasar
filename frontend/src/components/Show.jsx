import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import User from './User';
import ProjectList from './ProjectList';
import { useParams } from 'react-router-dom';
import { AlignLeft, X, LogOut, FileText, Sparkles, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Show() {
  const { id, projectId } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.style.background = isDark ? '#0f0f11' : '#f8fafc';
    document.body.style.color = isDark ? '#f8fafc' : '#111827';
  }, [theme, isDark]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const SidebarContent = ({ onClose }) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: isDark ? 'rgba(21, 21, 24, 0.92)' : '#ffffff',
          backdropFilter: isDark ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isDark ? 'blur(20px)' : 'none',
          borderRight: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
        }}
      >
        {/* Logo / Header */}
        <div
          style={{
            padding: '20px 20px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(124,58,237,0.4)',
              }}
            >
              <Sparkles size={16} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: isDark ? '#ffffff' : '#111827',
                letterSpacing: '-0.3px',
              }}
            >
              Quasar
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.05, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)' }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)',
                border: 'none',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                color: isDark ? '#e4e4e7' : '#1f2937',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: 'none',
                  borderRadius: 8,
                  padding: 6,
                  cursor: 'pointer',
                  color: '#b4b4b8',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </motion.button>
            )}
          </div>
        </div>

        {/* User section */}
        <div style={{ padding: '12px 16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.08)' }}>
          <User theme={theme} />
        </div>

        {/* Project list */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ProjectList ontoggle={onClose} />
        </div>

        {/* Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.button
            whileHover={{ scale: 1.02, background: 'rgba(239,68,68,0.15)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid rgba(239,68,68,0.25)',
              background: 'rgba(239,68,68,0.08)',
              color: '#f87171',
              cursor: 'pointer',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${isDark ? '#0f0f11' : '#f8fafc'}; color: ${isDark ? '#f8fafc' : '#111827'}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.12)'}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.18)'}; }
      `}</style>

      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          background: isDark ? '#0f0f11' : '#f8fafc',
          overflow: 'hidden',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              width: 260,
              flexShrink: 0,
              height: '100vh',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <SidebarContent />
          </motion.div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {projectId ? (
            <Editor
              key={`${projectId}-${id}`}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              isMobile={isMobile}
              projectId={projectId}
              id={id}
              theme={theme}
            />
          ) : (
            <NoProjectSelected isMobile={isMobile} toggleMenu={toggleMenu} theme={theme} />
          )}
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={toggleMenu}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  zIndex: 40,
                  backdropFilter: 'blur(4px)',
                }}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: 280,
                  height: '100vh',
                  zIndex: 50,
                }}
              >
                <SidebarContent onClose={toggleMenu} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function NoProjectSelected({ isMobile, toggleMenu, theme }) {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: isDark ? '#0f0f11' : '#f8fafc',
      }}
    >
      {/* Top bar for mobile */}
      {isMobile && (
        <div
          style={{
            padding: '16px 20px',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: 8,
              cursor: 'pointer',
              color: '#b4b4b8',
              display: 'flex',
            }}
          >
            <AlignLeft size={18} />
          </motion.button>
          <span style={{ color: isDark ? '#c7c7d2' : '#475569', fontSize: 14 }}>Quasar</span>
        </div>
      )}

      {/* Empty state */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          gap: 16,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124,58,237,0.15)',
          }}
        >
          <FileText size={32} color="#7c3aed" />
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ textAlign: 'center', maxWidth: 320 }}
        >
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: '#ffffff',
              marginBottom: 8,
              letterSpacing: '-0.3px',
            }}
          >
            Start documenting your ideas
          </h2>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 15,
              color: '#71717a',
              lineHeight: 1.6,
            }}
          >
            Capture notes, projects, and tasks in one place. Select a project from the sidebar to begin.
          </p>
        </motion.div>
      </div>
    </div>
  );
}