import React, { useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  Undo2, Redo2, List, ListOrdered,
  Heading1, Heading2, ChevronUp, ChevronDown,
  Highlighter, Image as ImageIcon, CheckSquare, Palette,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEPARATOR = 'sep';

const primaryTools = [
  { cmd: 'toggleBold',        icon: <Bold size={15} />,         label: 'Bold',          active: (e) => e.isActive('bold') },
  { cmd: 'toggleItalic',      icon: <Italic size={15} />,       label: 'Italic',        active: (e) => e.isActive('italic') },
  { cmd: 'toggleUnderline',   icon: <Underline size={15} />,    label: 'Underline',     active: (e) => e.isActive('underline') },
  { cmd: 'toggleStrike',      icon: <Strikethrough size={15} />,label: 'Strikethrough', active: (e) => e.isActive('strike') },
  SEPARATOR,
  { label: 'H1', customRun: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(), icon: <Heading1 size={15} />, active: (e) => e.isActive('heading', { level: 1 }) },
  { label: 'H2', customRun: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(), icon: <Heading2 size={15} />, active: (e) => e.isActive('heading', { level: 2 }) },
  SEPARATOR,
  { cmd: 'toggleBulletList',  icon: <List size={15} />,         label: 'Bullet List',   active: (e) => e.isActive('bulletList') },
  { cmd: 'toggleOrderedList', icon: <ListOrdered size={15} />,  label: 'Ordered List',  active: (e) => e.isActive('orderedList') },
  SEPARATOR,
  { cmd: 'undo',              icon: <Undo2 size={15} />,        label: 'Undo',          active: () => false },
  { cmd: 'redo',              icon: <Redo2 size={15} />,        label: 'Redo',          active: () => false },
];

function ToolBtn({ tool, editor, theme, showLabel = false }) {
  const isDark = theme === 'dark';
  const isActive = tool.active?.(editor) ?? false;

  const run = () => {
    if (tool.customRun) {
      tool.customRun(editor);
    } else if (tool.cmd) {
      editor.chain().focus()[tool.cmd]().run();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08, background: isActive ? 'rgba(124,58,237,0.35)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)' }}
      whileTap={{ scale: 0.92 }}
      onClick={run}
      title={tool.label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: showLabel ? 6 : 0,
        padding: showLabel ? '7px 12px' : '7px 9px',
        background: isActive ? 'rgba(124,58,237,0.25)' : 'transparent',
        border: isActive ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
        borderRadius: 8,
        cursor: 'pointer',
        color: isActive ? (isDark ? '#a78bfa' : '#4338ca') : (isDark ? '#b4b4b8' : '#475569'),
        transition: 'all 0.15s ease',
        flexShrink: 0,
        fontFamily: "'Manrope', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', color: isActive ? (isDark ? '#a78bfa' : '#4338ca') : (isDark ? '#b4b4b8' : '#475569') }}>
        {tool.icon}
      </span>
      {showLabel && <span>{tool.label}</span>}
    </motion.button>
  );
}

function Sep({ theme }) {
  const isDark = theme === 'dark';
  return (
    <div style={{
      width: 1,
      height: 20,
      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.12)',
      margin: '0 2px',
      flexShrink: 0,
    }} />
  );
}

export default function EditorToolbar({ editor, theme }) {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  if (!editor) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>

      {/* Extended options panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              background: isDark ? 'rgba(29,29,34,0.92)' : 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.12)',
              borderRadius: 14,
              boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.5)' : '0 4px 24px rgba(15,23,42,0.12)',
              flexWrap: 'wrap',
              maxWidth: '90vw',
            }}
          >
            {/* Highlight */}
            <ToolBtn
              tool={{
                icon: <Highlighter size={15} />,
                label: 'Highlight',
                customRun: (e) => e.chain().focus().toggleHighlight().run(),
                active: (e) => e.isActive('highlight'),
              }}
              editor={editor}
              theme={theme}
            />

            {/* Text color */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <motion.label
                whileHover={{ scale: 1.08, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)' }}
                whileTap={{ scale: 0.92 }}
                title="Text Color"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '7px 9px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: isDark ? '#b4b4b8' : '#475569',
                  border: '1px solid transparent',
                  transition: 'all 0.15s',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Palette size={15} />
                <input
                  type="color"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
                />
              </motion.label>
            </div>

            <Sep theme={theme} />

            {/* Insert image */}
            <ToolBtn
              tool={{
                icon: <ImageIcon size={15} />,
                label: 'Insert Image',
                customRun: (e) => {
                  const url = window.prompt('Enter image URL');
                  if (url) e.chain().focus().setImage({ src: url }).run();
                },
                active: () => false,
              }}
              editor={editor}
              theme={theme}
            />

            {/* Task list */}
            <ToolBtn
              tool={{
                icon: <CheckSquare size={15} />,
                label: 'Task List',
                customRun: (e) => e.chain().focus().toggleTaskList().run(),
                active: (e) => e.isActive('taskList'),
              }}
              editor={editor}
              theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary toolbar row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'nowrap',
        }}
      >
        {primaryTools.map((tool, i) =>
          tool === SEPARATOR
            ? <Sep key={`sep-${i}`} theme={theme} />
            : <ToolBtn key={tool.label} tool={tool} editor={editor} theme={theme} />
        )}

        <Sep theme={theme} />

        {/* Toggle more */}
        <motion.button
          whileHover={{ scale: 1.08, background: isOpen ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(o => !o)}
          title={isOpen ? 'Less options' : 'More options'}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '7px 9px',
            background: isOpen ? 'rgba(124,58,237,0.2)' : 'transparent',
            border: isOpen ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
            borderRadius: 8,
            cursor: 'pointer',
            color: isOpen ? '#a78bfa' : (isDark ? '#d4d4d8' : '#475569'),
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          {isOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </motion.button>
      </div>
    </div>
  );
}