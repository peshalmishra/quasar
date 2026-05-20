import axios from 'axios';
import React, { useState, useEffect } from 'react';import { useTheme } from '../ThemeContext.jsx';import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, Sparkles, AlertCircle, LogIn } from 'lucide-react';

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '11px 14px',
  background: hasError ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
  border: `1px solid ${hasError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10,
  color: '#e4e4e7',
  fontSize: 14,
  fontFamily: "'Manrope', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box',
});

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#71717a',
  fontFamily: "'Manrope', sans-serif",
  marginBottom: 6,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

export default function Login({ handleShow }) {
  const [input, setInput] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', both: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showX, setShowX] = useState(false);
  const [focused, setFocused] = useState('');
  const { isDark } = useTheme();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const USER_API_END_POINT = `${API_BASE_URL}/User`;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes('/login')) setShowX(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '', both: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { email: '', password: '', both: '' };

    if (!input.email) newErrors.email = 'Email is required';
    if (!input.password) newErrors.password = 'Password is required';
    if (!input.email && !input.password) newErrors.both = 'Both fields are required';

    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    try {
      const response = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const user = response.data.user;
      const token = response.data.token;
      const id = user._id || user.id;
      const projectId = response.data.lastProject ? response.data.lastProject._id : null;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('projectId', projectId);
      localStorage.setItem('role', user.role || 'member');
      localStorage.setItem('user', JSON.stringify({ id, name: user.name, email: user.email, role: user.role }));
      setInput({ email: '', password: '' });

      if (projectId) navigate(`/showtask/${id}/${projectId}`);
      else navigate(`/showtask/${id}`);
    } catch (err) {
      if (err.response?.status === 404) setErrors(p => ({ ...p, both: 'User does not exist' }));
      else if (err.response?.status === 401) setErrors(p => ({ ...p, both: 'Invalid credentials' }));
      else setErrors(p => ({ ...p, both: 'Login failed. Please try again.' }));
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Backdrop */}
      {showX && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleShow}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: showX ? 'fixed' : 'relative',
          inset: showX ? 0 : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: showX ? 101 : 'auto',
          minHeight: showX ? 'auto' : '100vh',
          background: showX ? 'transparent' : isDark ? '#0f0f11' : '#f8fafc',
          padding: 16,
        }}
      >
        <motion.div
          initial={{ scale: 0.94, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            width: '100%',
            maxWidth: 400,
            background: isDark ? '#151518' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.12)',
            borderRadius: 20,
            padding: 32,
            position: 'relative',
            boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.6)' : '0 24px 60px rgba(15,23,42,0.12)',
          }}
        >
          {/* Close */}
          {showX && (
            <motion.button
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShow}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.12)',
                borderRadius: 8, padding: 6, cursor: 'pointer',
                color: isDark ? '#cbd5e1' : '#475569', display: 'flex', alignItems: 'center',
              }}
            >
              <X size={15} />
            </motion.button>
          )}

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: isDark ? '#fff' : '#111827', letterSpacing: '-0.3px' }}>
              Quasar
            </span>
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 22, color: isDark ? '#fff' : '#111827', marginBottom: 4, letterSpacing: '-0.3px' }}>
            Welcome back
          </h2>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: isDark ? '#a1a1aa' : '#475569', marginBottom: 24 }}>
            Sign in to your account to continue
          </p>

          {/* Error alert */}
          <AnimatePresence>
            {errors.both && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                  fontSize: 13, fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                }}
              >
                <AlertCircle size={14} />
                {errors.both}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email" name="email" value={input.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                placeholder="you@example.com"
                style={{
                  ...inputStyle(!!errors.email),
                  borderColor: focused === 'email' && !errors.email ? 'rgba(124,58,237,0.5)' : undefined,
                  boxShadow: focused === 'email' ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
                }}
              />
              {errors.email && (
                <p style={{ color: '#f87171', fontSize: 11, fontFamily: "'Manrope', sans-serif", marginTop: 4 }}>
                  {errors.email}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={input.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  style={{
                    ...inputStyle(!!errors.password),
                    paddingRight: 44,
                    borderColor: focused === 'password' && !errors.password ? 'rgba(124,58,237,0.5)' : undefined,
                    boxShadow: focused === 'password' ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: isDark ? '#d1d5db' : '#475569', display: 'flex', padding: 2,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#f87171', fontSize: 11, fontFamily: "'Manrope', sans-serif", marginTop: 4 }}>
                  {errors.password}
                </p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(124,58,237,0.45)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 20px', marginTop: 4,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                color: '#fff', fontSize: 14, fontWeight: 700,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 0 16px rgba(124,58,237,0.3)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <LogIn size={15} />
              Sign in
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#52525b', fontFamily: "'Manrope', sans-serif" }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
              Register
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}