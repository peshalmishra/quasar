import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const TASK_API = `${API_BASE_URL}/Task`;

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasksByProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${TASK_API}/byProject/${projectId}`, { headers });
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchTasksByUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${TASK_API}/showTask/${userId}`, { headers });
      setTasks(res.data.task || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createTask = async (data) => {
    const res = await axios.post(`${TASK_API}/addtask`, data, { headers });
    setTasks(prev => [res.data.newtask, ...prev]);
    return res.data.newtask;
  };

  const updateTask = async (id, data) => {
    const res = await axios.put(`${TASK_API}/edittask/${id}`, data, { headers });
    setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t));
    return res.data.editTask;
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${TASK_API}/status/${id}`, { status }, { headers });
    setTasks(prev => prev.map(t => (t._id === id || t.id === id) ? { ...t, status } : t));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${TASK_API}/deleteTask/${id}`, { headers });
    setTasks(prev => prev.filter(t => t._id !== id && t.id !== id));
  };

  const uploadAttachment = async (taskId, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(',')[1];
          const res = await axios.post(
            `${TASK_API}/upload/${taskId}`,
            { filename: file.name, mimetype: file.type, data: base64, size: file.size },
            { headers }
          );
          resolve(res.data.attachment);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    tasks, loading, error,
    fetchTasksByProject, fetchTasksByUser,
    createTask, updateTask, updateStatus, deleteTask, uploadAttachment,
  };
}
