import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, CheckCircle2, Clock, Circle,
  AlertCircle, Paperclip, GripVertical, X
} from 'lucide-react';
import { useTheme } from '../ThemeContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import TaskForm from './TaskForm.jsx';

const COLUMNS = [
  { key: 'todo',       label: 'To-Do',       color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  icon: Circle },
  { key: 'inprogress', label: 'In Progress',  color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  icon: Clock },
  { key: 'done',       label: 'Done',         color: '#4ade80', bg: 'rgba(74,222,128,0.08)', icon: CheckCircle2 },
];

function SkeletonCard({ isDark }) {
  const shimmer = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';
  return (
    <div style={{ borderRadius: 12, padding: '14px', background: isDark ? '#1a1a1f' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.07)'}`, marginBottom: 8 }}>
      <div style={{ height: 12, borderRadius: 6, background: shimmer, marginBottom: 8, width: '70%' }} />
      <div style={{ height: 10, borderRadius: 6, background: shimmer, width: '40%' }} />
    </div>
  );
}

function TaskCard({ task, isDark, onDelete, onEdit, onStatusChange, isAdmin, role }) {
  const [dragging, setDragging] = useState(false);
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)';

  const statusMeta = COLUMNS.find(c => c.key === task.status) || COLUMNS[0];
  const nextStatus = { todo: 'inprogress', inprogress: 'done', done: 'todo' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(15,23,42,0.1)' }}
      style={{
        borderRadius: 12, padding: '13px 14px',
        background: isDark ? '#1a1a1f' : '#ffffff',
        border: `1px solid ${border}`,
        marginBottom: 8, cursor: 'grab', transition: 'box-shadow 0.2s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Left status accent */}
      <div style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3, background: statusMeta.color, borderRadius: '0 2px 2px 0' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingLeft: 8 }}>
        {/* Grip */}
        <GripVertical size={14} color={isDark ? '#3f3f46' : '#d1d5db'} style={{ marginTop: 2, flexShrink: 0 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600,
            color: isDark ? '#f4f4f5' : '#0f172a', margin: 0,
            wordBreak: 'break-word', lineHeight: 1.4,
          }}>
            {task.title}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {/* Status badge — click to advance */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onStatusChange(task._id || task.id, nextStatus[task.status])}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 20,
                background: statusMeta.bg, border: `1px solid ${statusMeta.color}40`,
                color: statusMeta.color, fontSize: 10, fontWeight: 700,
                fontFamily: "'Manrope', sans-serif", cursor: 'pointer',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}
            >
              {statusMeta.label}
            </motion.button>

            {task.attachments > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: isDark ? '#71717a' : '#94a3b8', fontFamily: "'Manrope', sans-serif" }}>
                <Paperclip size={10} />
                {task.attachments}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <motion.button
            whileHover={{ scale: 1.1, color: '#a78bfa' }} whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#52525b' : '#cbd5e1', display: 'flex', padding: 3 }}
          >
            <Edit3 size={13} />
          </motion.button>
          {(isAdmin || role === 'admin') && (
            <motion.button
              whileHover={{ scale: 1.1, color: '#f87171' }} whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(task._id || task.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#52525b' : '#cbd5e1', display: 'flex', padding: 3 }}
            >
              <Trash2 size={13} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TaskBoard({ projectId, userId }) {
  const { isDark } = useTheme();
  const { tasks, loading, error, fetchTasksByProject, createTask, updateTask, updateStatus, deleteTask, uploadAttachment } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const role = localStorage.getItem('role') || 'member';
  const isAdmin = role === 'admin';

  useEffect(() => {
    if (projectId) fetchTasksByProject(projectId);
  }, [projectId]);

  const tasksByStatus = (status) => tasks.filter(t => t.status === status || (!t.status && status === 'todo'));

  const handleCreate = async (data) => {
    await createTask({ ...data, projectId });
  };

  const handleEdit = async (data) => {
    await updateTask(editingTask._id || editingTask.id, data);
    setEditingTask(null);
  };

  const handleUpload = async (file) => {
    const taskId = editingTask?._id || editingTask?.id;
    if (taskId) await uploadAttachment(taskId, file);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    if (id) await updateStatus(id, status);
    setDraggedId(null);
  };

  const bg = isDark ? '#0f0f11' : '#f8fafc';
  const colBg = isDark ? '#151518' : '#f1f5f9';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
        borderBottom: `1px solid ${border}`,
      }}>
        <div>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a', margin: 0 }}>
            Task Board
          </h3>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: isDark ? '#71717a' : '#94a3b8', margin: '3px 0 0' }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} · drag to move between columns
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
          whileTap={{ scale: 0.96 }}
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
            fontFamily: "'Manrope', sans-serif", cursor: 'pointer',
            boxShadow: '0 0 12px rgba(124,58,237,0.3)',
          }}
        >
          <Plus size={15} />
          Add Task
        </motion.button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ padding: '12px 24px', background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={14} color="#f87171" />
          <span style={{ fontSize: 13, color: '#f87171', fontFamily: "'Manrope', sans-serif" }}>{error}</span>
        </div>
      )}

      {/* Kanban columns */}
      <div style={{
        flex: 1, overflowX: 'auto', overflowY: 'hidden',
        display: 'flex', gap: 16, padding: '20px 24px',
        alignItems: 'flex-start',
      }}>
        {COLUMNS.map(col => {
          const Icon = col.icon;
          const colTasks = tasksByStatus(col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDrop={(e) => handleDrop(e, col.key)}
              style={{
                flex: '0 0 300px', minHeight: 200, display: 'flex', flexDirection: 'column',
                background: colBg,
                border: `1px solid ${border}`,
                borderRadius: 16, overflow: 'hidden',
              }}
            >
              {/* Column header */}
              <div style={{
                padding: '14px 16px 12px',
                borderBottom: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, boxShadow: `0 0 6px ${col.color}` }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 700, color: isDark ? '#e4e4e7' : '#334155', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {col.label}
                </span>
                <span style={{
                  marginLeft: 'auto', minWidth: 22, height: 22, borderRadius: 20,
                  background: `${col.color}20`, color: col.color,
                  fontSize: 11, fontWeight: 700, fontFamily: "'Manrope', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 60px' }}>
                {loading ? (
                  [1, 2].map(i => <SkeletonCard key={i} isDark={isDark} />)
                ) : (
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <div
                        key={task._id || task.id}
                        draggable
                        onDragStart={e => { e.dataTransfer.setData('taskId', task._id || task.id); setDraggedId(task._id || task.id); }}
                        onDragEnd={() => setDraggedId(null)}
                        style={{ opacity: draggedId === (task._id || task.id) ? 0.5 : 1 }}
                      >
                        <TaskCard
                          task={task}
                          isDark={isDark}
                          isAdmin={isAdmin}
                          role={role}
                          onDelete={deleteTask}
                          onEdit={(t) => { setEditingTask(t); setShowForm(true); }}
                          onStatusChange={updateStatus}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                )}

                {/* Drop hint when empty */}
                {!loading && colTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      padding: '28px 16px', textAlign: 'center',
                      border: `2px dashed ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.1)'}`,
                      borderRadius: 10,
                    }}
                  >
                    <Icon size={20} color={col.color} style={{ opacity: 0.4, margin: '0 auto 8px', display: 'block' }} />
                    <p style={{ fontSize: 12, color: isDark ? '#52525b' : '#94a3b8', fontFamily: "'Manrope', sans-serif", margin: 0 }}>
                      Drop tasks here
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task form modal */}
      <AnimatePresence>
        {showForm && (
          <TaskForm
            initial={editingTask}
            onClose={() => { setShowForm(false); setEditingTask(null); }}
            onSubmit={editingTask ? handleEdit : handleCreate}
            onUpload={editingTask ? handleUpload : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
