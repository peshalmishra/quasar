import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext.jsx';
import { FilePlus2, Trash2, Search, FolderOpen, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECT_EMOJIS = ['📄', '✏️', '💡', '🚀', '🎯', '📊', '🔮', '⚡', '🌟', '🎨'];

function getEmoji(title = '') {
  const idx = title.charCodeAt(0) % PROJECT_EMOJIS.length;
  return PROJECT_EMOJIS[idx];
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ProjectList({ ontoggle }) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');
  const [projects, setProjects] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { id, projectId } = useParams();
  const { isDark } = useTheme();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const Project_API_END_POINT = `${API_BASE_URL}/Task`;

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${Project_API_END_POINT}/showTask/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.task);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token, id]);

  const handleAddProject = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        `${Project_API_END_POINT}/addtask`,
        { title: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenAdd(false);
      setInput('');
      fetchProjects();
      navigate(`/showtask/${id}/${res.data.newtask._id}`);
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddProject();
    if (e.key === 'Escape') { setOpenAdd(false); setInput(''); }
  };

  const handleDelete = async (pid) => {
    setDeletingId(pid);
    try {
      await axios.delete(`${Project_API_END_POINT}/deleteTask/${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentId = window.location.pathname.split('/').pop();
      if (currentId === pid) navigate(`/showtask/${id}`, { replace: true });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        padding: '12px 0',
      }}
    >
      {/* Search */}
      <div style={{ padding: '0 14px 10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10,
            padding: '7px 12px',
            transition: 'border-color 0.2s',
          }}
        >
          <Search size={13} color="#71717a" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#b4b4b8',
              fontSize: 13,
              fontFamily: "'Manrope', sans-serif",
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 14px 8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FolderOpen size={13} color="#71717a" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#71717a',
              textTransform: 'uppercase',
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Projects
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, color: '#a855f7' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setOpenAdd(true); setSearch(''); }}
          title="New project"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#71717a',
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            transition: 'color 0.2s',
          }}
        >
          <FilePlus2 size={15} />
        </motion.button>
      </div>

      {/* New project input */}
      <AnimatePresence>
        {openAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', padding: '0 14px 8px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 10,
                padding: '8px 12px',
              }}
            >
              <span style={{ fontSize: 15 }}>📄</span>
              <input
                autoFocus
                type="text"
                placeholder="Project name..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: 13,
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddProject}
                style={{
                  background: 'rgba(124,58,237,0.5)',
                  border: 'none',
                  borderRadius: 6,
                  padding: '3px 8px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 8px',
        }}
      >
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '24px 12px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: '#71717a',
                fontSize: 13,
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              {search ? 'No projects match your search' : 'No projects yet'}
            </p>
            {!search && !openAdd && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpenAdd(true)}
                style={{
                  marginTop: 10,
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  borderRadius: 8,
                  padding: '7px 14px',
                  cursor: 'pointer',
                  color: '#a78bfa',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                + New project
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.ul
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {filtered.map((project, i) => {
              const isActive = project.id === projectId;
              const isHovered = hoveredId === project.id;

              return (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onHoverStart={() => setHoveredId(project.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  style={{
                    borderRadius: 10,
                    marginBottom: 2,
                    background: isActive
                      ? 'rgba(124,58,237,0.18)'
                      : isHovered
                        ? 'rgba(255,255,255,0.05)'
                        : 'transparent',
                    border: isActive
                      ? '1px solid rgba(124,58,237,0.35)'
                      : isDark ? '1px solid transparent' : '1px solid transparent',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: 2.5,
                        background: 'linear-gradient(180deg, #7c3aed, #a855f7)',
                        borderRadius: '0 2px 2px 0',
                        boxShadow: '0 0 8px rgba(124,58,237,0.6)',
                      }}
                    />
                  )}

                  <Link
                    onClick={ontoggle}
                    to={`/showtask/${id}/${project.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 10px 9px 14px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>
                      {getEmoji(project.title)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#ffffff' : '#b4b4b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transition: 'color 0.15s',
                        }}
                      >
                        {project.title}
                      </div>
                      {project.updatedAt && (
                        <div
                          style={{
                            fontSize: 11,
                            color: '#71717a',
                            fontFamily: "'Manrope', sans-serif",
                            marginTop: 1,
                          }}
                        >
                          {timeAgo(project.updatedAt)}
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {(isHovered || isActive) && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.12 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          disabled={deletingId === project.id}
                          style={{
                            background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 6,
                            padding: 4,
                            cursor: 'pointer',
                            color: '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0,
                            opacity: deletingId === project.id ? 0.5 : 1,
                          }}
                        >
                          <Trash2 size={12} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </div>
  );
}