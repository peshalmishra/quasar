import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Plus, Trash2, Edit3,
  CheckCircle2, Clock, Circle, AlertTriangle,
  TrendingUp, Users, Zap, AlertCircle, ChevronRight,
  RefreshCw, Archive, BarChart3
} from 'lucide-react';
import { useTheme } from '../ThemeContext.jsx';
import { useProjects } from '../hooks/useProjects.js';
import ProjectForm from './ProjectForm.jsx';
import TaskBoard from './TaskBoard.jsx';

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  icon: Zap },
  completed: { label: 'Completed', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', icon: CheckCircle2 },
  archived:  { label: 'Archived',  color: '#71717a', bg: 'rgba(113,113,122,0.1)', icon: Archive },
};

function SkeletonProjectCard({ isDark }) {
  const s = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';
  return (
    <div style={{
      borderRadius: 16, padding: 20,
      background: isDark ? '#151518' : '#ffffff',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'}`,
    }}>
      <div style={{ height: 14, borderRadius: 7, background: s, marginBottom: 10, width: '60%' }} />
      <div style={{ height: 10, borderRadius: 5, background: s, marginBottom: 16, width: '80%' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 28, flex: 1, borderRadius: 8, background: s }} />)}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, isDark }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15,23,42,0.1)' }}
      style={{
        flex: '1 1 160px', padding: '18px 20px', borderRadius: 16,
        background: isDark ? '#151518' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'}`,
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: isDark ? '#71717a' : '#94a3b8', marginTop: 4 }}>
        {label}
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, isDark, onEdit, onDelete, onOpen, isAdmin }) {
  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
  const StatusIcon = cfg.icon;
  const counts = project.taskCounts || { todo: 0, inprogress: 0, done: 0, total: 0 };
  const progress = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.5)' : '0 16px 48px rgba(15,23,42,0.12)' }}
      style={{
        borderRadius: 18, overflow: 'hidden',
        background: isDark ? '#151518' : '#ffffff',
        border: `1px solid ${border}`,
        transition: 'box-shadow 0.25s',
        cursor: 'pointer',
      }}
      onClick={() => onOpen(project)}
    >
      {/* Top accent */}
      <div style={{ height: 3, background: `linear-gradient(90deg, #7c3aed, #a855f7)` }} />

      <div style={{ padding: '18px 20px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700,
            color: isDark ? '#f4f4f5' : '#0f172a', margin: 0,
            maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {project.title}
          </h3>
          <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
            <motion.button
              whileHover={{ scale: 1.15, color: '#a78bfa' }} whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(project)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#52525b' : '#94a3b8', display: 'flex', padding: 4 }}
            >
              <Edit3 size={13} />
            </motion.button>
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.15, color: '#f87171' }} whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(project._id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#52525b' : '#94a3b8', display: 'flex', padding: 4 }}
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 12, color: isDark ? '#71717a' : '#64748b',
            margin: '0 0 12px', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {project.description}
          </p>
        )}

        {/* Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20,
            background: cfg.bg, border: `1px solid ${cfg.color}30`,
          }}>
            <StatusIcon size={11} color={cfg.color} />
            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, fontFamily: "'Manrope', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {counts.total > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: isDark ? '#71717a' : '#94a3b8', fontFamily: "'Manrope', sans-serif" }}>Progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', fontFamily: "'Manrope', sans-serif" }}>{progress}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #7c3aed, #4ade80)' }}
              />
            </div>
          </div>
        )}

        {/* Task counts */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'To-Do', count: counts.todo, color: '#60a5fa' },
            { label: 'In Progress', count: counts.inprogress, color: '#fbbf24' },
            { label: 'Done', count: counts.done, color: '#4ade80' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, padding: '7px 6px', borderRadius: 10, textAlign: 'center',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
              border: `1px solid ${border}`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: s.color, fontFamily: "'Manrope', sans-serif" }}>{s.count}</div>
              <div style={{ fontSize: 9, color: isDark ? '#52525b' : '#94a3b8', fontFamily: "'Manrope', sans-serif", marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Open indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 14 }}>
          <span style={{ fontSize: 11, color: '#7c3aed', fontFamily: "'Manrope', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            Open Board <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard({ userId }) {
  const { isDark } = useTheme();
  const { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const role = localStorage.getItem('role') || 'member';
  const isAdmin = role === 'admin';

  useEffect(() => { fetchProjects(); }, []);

  const totalTasks  = projects.reduce((a, p) => a + (p.taskCounts?.total || 0), 0);
  const doneTasks   = projects.reduce((a, p) => a + (p.taskCounts?.done || 0), 0);
  const activePrj   = projects.filter(p => p.status === 'active').length;
  const inProgress  = projects.reduce((a, p) => a + (p.taskCounts?.inprogress || 0), 0);

  const bg     = isDark ? '#0f0f11' : '#f8fafc';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)';

  /* ── Task board view ── */
  if (activeProject) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Back nav */}
        <div style={{
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${border}`,
          background: isDark ? 'rgba(15,15,17,0.8)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)', flexShrink: 0,
        }}>
          <motion.button
            whileHover={{ scale: 1.04, x: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => { setActiveProject(null); fetchProjects(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9,
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              color: '#a78bfa', fontSize: 13, fontWeight: 600,
              fontFamily: "'Manrope', sans-serif", cursor: 'pointer',
            }}
          >
            ← Dashboard
          </motion.button>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
            {activeProject.title}
          </span>
          <div style={{
            padding: '3px 10px', borderRadius: 20,
            background: STATUS_CONFIG[activeProject.status]?.bg,
            color: STATUS_CONFIG[activeProject.status]?.color,
            fontSize: 10, fontWeight: 700, fontFamily: "'Manrope', sans-serif",
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {STATUS_CONFIG[activeProject.status]?.label}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <TaskBoard projectId={activeProject._id} userId={userId} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(124,58,237,0.4)',
              }}>
                <LayoutDashboard size={18} color="#fff" />
              </div>
              <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
                Team Dashboard
              </h1>
            </div>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: isDark ? '#71717a' : '#94a3b8', margin: 0 }}>
              Manage projects and track team workflows
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }} whileTap={{ scale: 0.95 }}
              onClick={fetchProjects}
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                border: `1px solid ${border}`, borderRadius: 10, padding: 9,
                cursor: 'pointer', color: isDark ? '#71717a' : '#64748b', display: 'flex',
                transition: 'all 0.2s',
              }}
              title="Refresh"
            >
              <RefreshCw size={15} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setEditingProject(null); setShowForm(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                fontFamily: "'Manrope', sans-serif", cursor: 'pointer',
                boxShadow: '0 0 14px rgba(124,58,237,0.3)',
              }}
            >
              <Plus size={15} /> New Project
            </motion.button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
          <StatCard label="Total Projects" value={projects.length} icon={FolderOpen} color="#7c3aed" isDark={isDark} />
          <StatCard label="Active"         value={activePrj}        icon={Zap}        color="#4ade80" isDark={isDark} />
          <StatCard label="Total Tasks"    value={totalTasks}        icon={BarChart3}  color="#60a5fa" isDark={isDark} />
          <StatCard label="In Progress"    value={inProgress}        icon={Clock}      color="#fbbf24" isDark={isDark} />
          <StatCard label="Completed"      value={doneTasks}         icon={CheckCircle2} color="#a78bfa" isDark={isDark} />
        </div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
              borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              marginBottom: 24,
            }}
          >
            <AlertCircle size={16} color="#f87171" />
            <span style={{ fontSize: 13, color: '#f87171', fontFamily: "'Manrope', sans-serif" }}>{error}</span>
            <motion.button
              whileHover={{ scale: 1.1 }} onClick={fetchProjects}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}
            >
              <RefreshCw size={14} />
            </motion.button>
          </motion.div>
        )}

        {/* Projects section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <FolderOpen size={15} color={isDark ? '#71717a' : '#94a3b8'} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 700, color: isDark ? '#71717a' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Projects ({projects.length})
          </span>
        </div>

        {/* Project grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[1,2,3].map(i => <SkeletonProjectCard key={i} isDark={isDark} />)}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '60px 24px',
              background: isDark ? '#151518' : '#ffffff',
              border: `2px dashed ${border}`, borderRadius: 20,
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <FolderOpen size={28} color="#7c3aed" />
            </div>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a', marginBottom: 8 }}>
              No projects yet
            </h3>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: isDark ? '#71717a' : '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
              Create your first project to start organizing your team's work
            </p>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowForm(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '11px 22px', borderRadius: 11,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                fontFamily: "'Manrope', sans-serif", cursor: 'pointer',
                boxShadow: '0 0 14px rgba(124,58,237,0.3)',
              }}
            >
              <Plus size={16} /> Create Project
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <AnimatePresence>
              {projects.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isDark={isDark}
                  isAdmin={isAdmin}
                  onEdit={(p) => { setEditingProject(p); setShowForm(true); }}
                  onDelete={deleteProject}
                  onOpen={setActiveProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Project form modal */}
      <AnimatePresence>
        {showForm && (
          <ProjectForm
            initial={editingProject}
            onClose={() => { setShowForm(false); setEditingProject(null); }}
            onSubmit={editingProject
              ? (data) => updateProject(editingProject._id, data)
              : createProject
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
