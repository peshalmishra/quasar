import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import TableOfContents from './EditorComponents/TOC';
import EditorToolbar from './EditorComponents/EditorToolbar';
import { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
  AlignLeft, Download, MoreHorizontal, Check, Loader2,
  Share2, FileText, Hash
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Inline styles ─────────────────────────────────────────── */
const EDITOR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.quasar-editor-wrap .ProseMirror {
  outline: none;
  min-height: 60vh;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #e4e4e7;
  caret-color: #7c3aed;
}

.quasar-editor-wrap .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #3f3f46;
  pointer-events: none;
  position: absolute;
  font-style: italic;
}

.quasar-editor-wrap .ProseMirror p { margin: 0 0 0.75em; }

.quasar-editor-wrap .ProseMirror h1 {
  font-size: 2em; font-weight: 800; color: #fff;
  letter-spacing: -0.03em; margin: 1.2em 0 0.4em; line-height: 1.2;
}
.quasar-editor-wrap .ProseMirror h2 {
  font-size: 1.5em; font-weight: 700; color: #f4f4f5;
  letter-spacing: -0.02em; margin: 1em 0 0.4em; line-height: 1.3;
}
.quasar-editor-wrap .ProseMirror h3 {
  font-size: 1.2em; font-weight: 600; color: #e4e4e7;
  margin: 0.9em 0 0.35em;
}
.quasar-editor-wrap .ProseMirror h4, .quasar-editor-wrap .ProseMirror h5, .quasar-editor-wrap .ProseMirror h6 {
  font-weight: 600; color: #d4d4d8; margin: 0.8em 0 0.3em;
}

.quasar-editor-wrap .ProseMirror strong { color: #fff; font-weight: 700; }
.quasar-editor-wrap .ProseMirror em { color: #a1a1aa; }
.quasar-editor-wrap .ProseMirror s { color: #71717a; }

.quasar-editor-wrap .ProseMirror ul,
.quasar-editor-wrap .ProseMirror ol {
  padding-left: 1.6em; margin: 0.5em 0 0.75em;
}
.quasar-editor-wrap .ProseMirror li { margin: 0.2em 0; color: #d4d4d8; }
.quasar-editor-wrap .ProseMirror li::marker { color: #7c3aed; }

.quasar-editor-wrap .ProseMirror code {
  background: rgba(124,58,237,0.12);
  border: 1px solid rgba(124,58,237,0.2);
  border-radius: 5px;
  padding: 1px 6px;
  font-size: 0.88em;
  color: #a78bfa;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.quasar-editor-wrap .ProseMirror pre {
  background: rgba(15,15,17,0.8);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin: 1em 0;
  overflow-x: auto;
}
.quasar-editor-wrap .ProseMirror pre code {
  background: none;
  border: none;
  padding: 0;
  color: #e4e4e7;
  font-size: 14px;
}

.quasar-editor-wrap .ProseMirror blockquote {
  border-left: 3px solid #7c3aed;
  padding: 0.4em 0 0.4em 1.1em;
  margin: 1em 0;
  color: #71717a;
  font-style: italic;
  background: rgba(124,58,237,0.04);
  border-radius: 0 8px 8px 0;
}

.quasar-editor-wrap .ProseMirror hr {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 1.5em 0;
}

.quasar-editor-wrap .ProseMirror a {
  color: #a78bfa;
  text-decoration: underline;
  text-decoration-color: rgba(167,139,250,0.4);
  transition: color 0.15s;
}
.quasar-editor-wrap .ProseMirror a:hover { color: #c4b5fd; }

.quasar-editor-wrap .ProseMirror ul[data-type="taskList"] { padding-left: 0.4em; }
.quasar-editor-wrap .ProseMirror li[data-type="taskItem"] {
  display: flex; align-items: flex-start; gap: 8px;
}
.quasar-editor-wrap .ProseMirror li[data-type="taskItem"] > label {
  margin-top: 3px; cursor: pointer;
}
.quasar-editor-wrap .ProseMirror li[data-type="taskItem"] > label input[type="checkbox"] {
  accent-color: #7c3aed; width: 15px; height: 15px; cursor: pointer;
}
.quasar-editor-wrap .ProseMirror li[data-type="taskItem"][data-checked="true"] > div {
  color: #71717a; text-decoration: line-through;
}

.quasar-editor-wrap .ProseMirror img {
  max-width: 100%;
  border-radius: 10px;
  margin: 0.5em 0;
  border: 1px solid rgba(255,255,255,0.08);
}

/* selection */
.quasar-editor-wrap .ProseMirror ::selection {
  background: rgba(124,58,237,0.3);
}
`;

/* ─── Component ─────────────────────────────────────────────── */
const Editor = ({ isMenuOpen, toggleMenu, isMobile, projectId, id, theme }) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const isDark = theme === 'dark';
  const [saveState, setSaveState] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [projectDetail, setProjectDetail] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const contentRef = useRef();
  const saveTimeout = useRef();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const Project_API_END_POINT = `${API_BASE_URL}/Task`;
  const token = localStorage.getItem('token');

  /* fetch project */
  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await axios.get(
          `${Project_API_END_POINT}/showOne/${id}/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjectDetail(response.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchProjectDetail();
  }, [id, projectId, token]);

  /* editor */
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { HTMLAttributes: { 'data-pos': (node) => node.pos } },
      }),
      Placeholder.configure({ placeholder: 'Start writing your ideas here…' }),
      Link.configure({ openOnClick: true, autolink: true }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6], HTMLAttributes: { class: 'heading' } }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      Image.configure({ inline: true, allowBase64: true }),
      TaskList,
      TaskItem.configure({ HTMLAttributes: { class: 'task-item' } }),
    ],
    content: projectDetail?.description || '',
  });

  /* auto-save with debounce */
  useEffect(() => {
    if (!editor) return;

    const update = async () => {
      clearTimeout(saveTimeout.current);
      setSaveState('saving');

      const jsonContent = editor.getJSON();
      const hasHeading = jsonContent.content?.some(b => b.type?.startsWith('heading'));
      setIsEmpty(!hasHeading);

      saveTimeout.current = setTimeout(async () => {
        try {
          await axios.put(
            `${Project_API_END_POINT}/edittask/${projectId}`,
            { description: jsonContent },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSaveState('saved');
        } catch (err) {
          setSaveState('error');
          console.error('Auto-save error:', err);
        }
      }, 800);
    };

    editor.on('update', update);
    return () => {
      editor.off('update', update);
      clearTimeout(saveTimeout.current);
    };
  }, [editor, projectId, token]);

  /* set content when fetched */
  useEffect(() => {
    if (editor && projectDetail?.description) {
      try {
        editor.commands.setContent(projectDetail.description);
      } catch (err) {
        console.error('Error setting content:', err);
      }
    }
  }, [editor, projectDetail]);

  /* PDF export */
  const exportToPDF = () => {
    if (!contentRef.current) return;
    const content = contentRef.current;
    const originalStyles = new Map();
    const elements = content.querySelectorAll('*');
    elements.forEach(el => {
      originalStyles.set(el, { color: el.style.color, backgroundColor: el.style.backgroundColor });
      el.style.color = '#000000';
      el.style.backgroundColor = '#ffffff';
    });
    content.style.color = '#000000';
    content.style.backgroundColor = '#ffffff';

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${projectDetail?.title || 'document'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(content)
      .save()
      .then(() => {
        elements.forEach(el => {
          const o = originalStyles.get(el);
          el.style.color = o.color;
          el.style.backgroundColor = o.backgroundColor;
        });
        content.style.color = '';
        content.style.backgroundColor = '';
      });
  };

  if (!editor) return null;

  if (!projectDetail) {
    return (
      <div style={{
        height: '100vh',
        background: isDark ? '#0f0f11' : '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={28} color="#7c3aed" />
          </motion.div>
          <span style={{ color: '#71717a', fontSize: 13, fontFamily: "'Manrope', sans-serif" }}>
            Loading project…
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{EDITOR_CSS}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          background: isDark ? '#0f0f11' : '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Top Nav ── */}
        <motion.nav
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            height: 52,
            background: isDark ? 'rgba(15,15,17,0.8)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.08)',
            flexShrink: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleMenu}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.12)',
                  borderRadius: 8,
                  padding: 7,
                  cursor: 'pointer',
                  color: isDark ? '#b4b4b8' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AlignLeft size={16} />
              </motion.button>
            )}

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={13} color="#71717a" />
              <span style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: '#e4e4e7',
                maxWidth: isMobile ? 140 : 300,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {projectDetail.title}
              </span>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Save indicator */}
            <AnimatePresence mode="wait">
              <motion.div
                key={saveState}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: saveState === 'saving'
                    ? 'rgba(250,204,21,0.1)'
                    : saveState === 'error'
                      ? 'rgba(239,68,68,0.1)'
                      : 'rgba(34,197,94,0.1)',
                  border: `1px solid ${saveState === 'saving'
                    ? 'rgba(250,204,21,0.2)'
                    : saveState === 'error'
                      ? 'rgba(239,68,68,0.2)'
                      : 'rgba(34,197,94,0.15)'}`,
                }}
              >
                {saveState === 'saving' ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Loader2 size={11} color="#fbbf24" />
                    </motion.div>
                    <span style={{ fontSize: 11, color: '#fbbf24', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Saving…</span>
                  </>
                ) : saveState === 'error' ? (
                  <span style={{ fontSize: 11, color: '#f87171', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Save failed</span>
                ) : (
                  <>
                    <Check size={11} color="#4ade80" />
                    <span style={{ fontSize: 11, color: '#4ade80', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Saved</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* TOC toggle (only when headings exist) */}
            {!isEmpty && (
              <motion.span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 8px',
                  borderRadius: 8,
                  color: '#71717a',
                  cursor: 'default',
                  fontSize: 12,
                  fontFamily: "'Manrope', sans-serif",
                  gap: 4,
                }}
              >
                <Hash size={13} />
                <span style={{ display: isMobile ? 'none' : 'inline' }}>Contents</span>
              </motion.span>
            )}

            {/* Menu button */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setShowMenu(m => !m)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  padding: 7,
                  cursor: 'pointer',
                  color: '#b4b4b8',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <MoreHorizontal size={16} />
              </motion.button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: '#1d1d22',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      padding: '6px',
                      minWidth: 180,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      zIndex: 50,
                    }}
                  >
                    {[
                      { icon: <Download size={14} />, label: 'Export to PDF', action: exportToPDF },
                      { icon: <Share2 size={14} />, label: 'Share', action: () => {} },
                    ].map(item => (
                      <motion.button
                        key={item.label}
                        whileHover={{ background: 'rgba(255,255,255,0.06)' }}
                        onClick={() => { item.action(); setShowMenu(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          padding: '9px 12px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          color: '#b4b4b8',
                          fontSize: 13,
                          fontFamily: "'Manrope', sans-serif",
                          fontWeight: 500,
                          textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                      >
                        <span style={{ color: '#71717a' }}>{item.icon}</span>
                        {item.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', position: 'relative' }}>
          {/* Editor + Toolbar */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px 24px 140px',
            }}
          >
            {/* Document title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', maxWidth: 720 }}
            >
              <div className="quasar-editor-wrap" style={{ position: 'relative' }}>
                <div ref={contentRef}>
                  <EditorContent editor={editor} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* TOC sidebar (desktop only) */}
          {!isEmpty && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 200,
                flexShrink: 0,
                overflowY: 'auto',
                padding: '32px 16px 32px 0',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <TableOfContents editor={editor} />
            </motion.div>
          )}
        </div>

        {/* ── Floating Toolbar ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: 'spring', damping: 20 }}
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            background: isDark ? 'rgba(29,29,34,0.9)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.12)',
            borderRadius: 18,
            padding: '6px 10px',
            boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset' : '0 8px 40px rgba(15,23,42,0.15), 0 0 0 1px rgba(15,23,42,0.08) inset',
          }}
        >
          <EditorToolbar editor={editor} theme={theme} />
        </motion.div>

        {/* Click-outside to close menu */}
        {showMenu && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>
    </>
  );
};

export default Editor;