import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, Sparkles, AlertCircle, UserPlus } from 'lucide-react';

const inputStyle = (hasError, isFocused) => ({
  width: '100%',
  padding: '11px 14px',
  background: hasError ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
  border: `1px solid ${hasError ? 'rgba(239,68,68,0.4)' : isFocused ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10,
  color: '#e4e4e7',
  fontSize: 14,
  fontFamily: "'Manrope', sans-serif",
  outline: 'none',
  boxShadow: isFocused && !hasError ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
});

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: '#71717a', fontFamily: "'Manrope', sans-serif",
  marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase',
};

export default function Register({ handleShow }) {
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', all: '' });
  const [focused, setFocused] = useState('');
  const [showX, setShowX] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const USER_API_END_POINT = `${API_BASE_URL}/User`;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes('/register')) setShowX(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '', all: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { name: '', email: '', password: '', all: '' };

    if (!input.name && !input.email && !input.password) newErrors.all = 'Please fill all fields';
    if (!input.name) { newErrors.name = 'Username is required'; newErrors.all = 'Username is required'; }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email) { newErrors.email = 'Email is required'; newErrors.all = 'Email is required'; }
    else if (!emailPattern.test(input.email)) { newErrors.email = 'Invalid email format'; newErrors.all = 'Invalid email format'; }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!input.password) { newErrors.password = 'Password is required'; newErrors.all = 'Password is required'; }
    else if (input.password.length < 8 || input.password.length > 20) {
      newErrors.password = 'Password must be 8–20 characters'; newErrors.all = 'Password must be 8–20 characters';
    } else if (!passwordPattern.test(input.password)) {
      newErrors.password = 'Must include uppercase, lowercase, number & special char';
      newErrors.all = 'Password requirements not met';
    }

    setErrors(newErrors);
    if (newErrors.name || newErrors.email || newErrors.password) return;

    try {
      await axios.post(`${USER_API_END_POINT}/register`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setInput({ name: '', email: '', password: '' });
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 409)
        setErrors(p => ({ ...p, all: 'Username or email already exists' }));
      else
        setErrors(p => ({ ...p, all: 'Registration failed. Please try again.' }));
    }
  };

  const fields = [
    { name: 'name',     label: 'Username', type: 'text',  placeholder: 'Your name',         delay: 0 },
    { name: 'email',    label: 'Email',    type: 'email', placeholder: 'you@example.com',    delay: 0.06 },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      {showX && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={handleShow}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100 }}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        style={{
          position: showX ? 'fixed' : 'relative',
          inset: showX ? 0 : 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: showX ? 101 : 'auto',
          minHeight: showX ? 'auto' : '100vh',
          background: showX ? 'transparent' : '#0f0f11',
          padding: 16,
        }}
      >
        <motion.div
          initial={{ scale: 0.94, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            width: '100%', maxWidth: 400,
            background: '#151518',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: 32, position: 'relative',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          {showX && (
            <motion.button
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShow}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: 6, cursor: 'pointer',
                color: '#71717a', display: 'flex', alignItems: 'center',
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
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.3px' }}>
              Quasar
            </span>
          </div>

          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 4, letterSpacing: '-0.3px' }}>
            Create an account
          </h2>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: '#71717a', marginBottom: 24 }}>
            Start writing, organizing and collaborating
          </p>

          <AnimatePresence>
            {errors.all && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171', fontSize: 13,
                  fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                }}
              >
                <AlertCircle size={14} />
                {errors.all}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fields.map(field => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: field.delay, duration: 0.3 }}
              >
                <label style={labelStyle}>{field.label}</label>
                <input
                  type={field.type} name={field.name} value={input[field.name]}
                  onChange={handleChange}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused('')}
                  placeholder={field.placeholder}
                  style={inputStyle(!!errors[field.name], focused === field.name)}
                />
                {errors[field.name] && (
                  <p style={{ color: '#f87171', fontSize: 11, fontFamily: "'Manrope', sans-serif", marginTop: 4 }}>
                    {errors[field.name]}
                  </p>
                )}
              </motion.div>
            ))}

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.3 }}
            >
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={input.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="Min 8 chars, upper, number & symbol"
                  style={{ ...inputStyle(!!errors.password, focused === 'password'), paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#52525b', display: 'flex', padding: 2,
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
              <UserPlus size={15} />
              Create account
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#52525b', fontFamily: "'Manrope', sans-serif" }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}