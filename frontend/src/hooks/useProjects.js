import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const PROJECT_API = `${API_BASE_URL}/Project`;

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${PROJECT_API}/all`, { headers });
      setProjects(res.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createProject = async (data) => {
    const res = await axios.post(`${PROJECT_API}/create`, data, { headers });
    await fetchProjects();
    return res.data.project;
  };

  const updateProject = async (id, data) => {
    const res = await axios.put(`${PROJECT_API}/${id}`, data, { headers });
    await fetchProjects();
    return res.data.project;
  };

  const deleteProject = async (id) => {
    await axios.delete(`${PROJECT_API}/${id}`, { headers });
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  return { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject };
}
