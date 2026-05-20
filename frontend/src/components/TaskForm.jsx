import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare, Paperclip, AlertCircle, Upload } from 'lucide-react';
import { useTheme } from '../ThemeContext.jsx';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To-Do', color: '#60a5fa' },
  { value: 'inprogress', label: 'In Progress', color: '#fbbf24' },
  { value: 'done', label: 'Done', color: '#4ade80' },
];

export default function TaskForm({ onClose, onSubmit, initial = null, onUpload }) {
  const { isDark } = useTheme();
  const [title, setTitle] = useState(initial?.title || '');
  const [status, setStatus] = useState(initial?.status || 'todo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const fileRef = useRef();
  const isEdit = !!initial;

  const bg = isDark ? '#1a1a1f' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)';
  const textPrimary = isDark ? '#f4f4f5' : '#0f172a';
  const textMuted = isDark ? '#71717a' : '#64748b';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Task title is required'); return; }
    setLoading(true); setError('');
    try {
      await onSubmit({ title: title.trim(), status });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !onUpload) return;
    setUploading(true);
    try {
      await onUpload(file);
      setAttachmentName(file.name);
    } catch {
      setError('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            width: '100%', maxWidth: 460,
            background: bg, border: `1px solid ${border}`,
            borderRadius: 20, padding: '28px 28px 24px',
            boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.7)' : '0 32px 80px rgba(15,23,42,0.15)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(124,58,237,0.4)',
              }}>
                <CheckSquare size={17} color="#fff" />
              </div>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 17, color: textPrimary, margin: 0 }}>
                {isEdit ? 'Edit Task' : 'New Task'}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: textMuted, display: 'flex' }}
            >
              <X size={16} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: textMuted, fontFamily: "'Manrope', sans-serif", marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Task Title *
              </label>
              <input
                autoFocus value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Design landing page"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  background: inputBg, border: `1px solid ${border}`,
                  color: textPrimary, fontSize: 14, fontFamily: "'Manrope', sans-serif",
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                onBlur={e => e.target.style.borderColor = border}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: textMuted, fontFamily: "'Manrope', sans-serif", marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Status
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value} type="button" onClick={() => setStatus(opt.value)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 9,
                      border: status === opt.value ? `1.5px solid ${opt.color}` : `1px solid ${border}`,
                      background: status === opt.value ? `${opt.color}18` : inputBg,
                      color: status === opt.value ? opt.color : textMuted,
                      fontSize: 11, fontWeight: 600, fontFamily: "'Manrope', sans-serif",
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Attachment */}
            {onUpload && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: textMuted, fontFamily: "'Manrope', sans-serif", marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Attachment
                </label>
                <input ref={fileRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                <motion.button
                  type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    background: inputBg, border: `1px dashed ${border}`,
                    color: attachmentName ? '#4ade80' : textMuted,
                    fontSize: 13, fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.15s', boxSizing: 'border-box',
                  }}
                >
                  {uploading ? <Upload size={14} /> : <Paperclip size={14} />}
                  {uploading ? 'Uploading…' : attachmentName || 'Click to attach a file'}
                </motion.button>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <AlertCircle size={14} color="#f87171" />
                <span style={{ fontSize: 13, color: '#f87171', fontFamily: "'Manrope', sans-serif" }}>{error}</span>
              </motion.div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <motion.button
                type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                style={{ flex: 1, padding: '11px', borderRadius: 10, background: inputBg, border: `1px solid ${border}`, color: textMuted, fontSize: 14, fontWeight: 600, fontFamily: "'Manrope', sans-serif", cursor: 'pointer' }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit" whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(124,58,237,0.45)' }} whileTap={{ scale: 0.97 }}
                disabled={loading}
                style={{
                  flex: 2, padding: '11px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1, boxShadow: '0 0 14px rgba(124,58,237,0.3)',
                }}
              >
                {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
