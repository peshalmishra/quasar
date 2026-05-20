import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext.jsx';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Mail, User as UserIcon } from 'lucide-react';

export default function User({ theme }) {
  const themeContext = useTheme();
  const activeTheme = theme || themeContext.theme;
  const isDark = activeTheme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const USER_API_END_POINT = `${API_BASE_URL}/User`;
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : {};
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!id || !token) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/showDetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(res.data);
      } catch (err) {
        console.error('Unable to load user details:', err?.response?.data || err.message);
      }
    };
    fetch();
  }, [id, token]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const initials = userDetails?.name
    ? userDetails.name.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Avatar button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          border: '2px solid rgba(124,58,237,0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          color: '#fff',
          letterSpacing: '0.05em',
          boxShadow: '0 0 12px rgba(124,58,237,0.35)',
          flexShrink: 0,
        }}
      >
        {initials}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: 0,
              minWidth: 220,
              background: isDark ? '#1d1d22' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.12)',
              borderRadius: 14,
              padding: '6px',
              boxShadow: isDark ? '0 20px 48px rgba(0,0,0,0.6)' : '0 18px 40px rgba(15,23,42,0.08)',
              zIndex: 1000,
            }}
          >
            {/* User info header */}
            <div
              style={{
                padding: '10px 12px 12px',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                marginBottom: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: "'Manrope', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isDark ? '#ffffff' : '#0f172a',
                      fontFamily: "'Manrope', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {userDetails?.name || 'Guest User'}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isDark ? '#a1a1aa' : '#475569',
                      fontFamily: "'Manrope', sans-serif",
                      marginTop: 1,
                    }}
                  >
                    {userDetails?.email || 'No email'}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            {[
              {
                icon: <UserIcon size={13} />,
                label: userDetails?.name || 'Profile',
                sub: 'View profile',
              },
              {
                icon: <Mail size={13} />,
                label: userDetails?.email || 'Email',
                sub: 'Account email',
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  cursor: 'default',
                  color: isDark ? '#e4e4e7' : '#334155',
                }}
              >
                <span style={{ color: '#71717a', display: 'flex' }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: isDark ? '#e4e4e7' : '#0f172a',
                      fontFamily: "'Manrope', sans-serif",
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', fontFamily: "'Manrope', sans-serif" }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}

            {/* Logout */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4, paddingTop: 4 }}>
              <motion.button
                whileHover={{ background: 'rgba(239,68,68,0.1)' }}
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: '#f87171',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  transition: 'background 0.15s',
                }}
              >
                <LogOut size={13} />
                Sign out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}