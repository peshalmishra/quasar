import express from 'express';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
} from '../controllers/project.controllers.js';
import { authenticationToken } from '../Middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/create', authenticationToken, createProject);
router.get('/all', authenticationToken, getProjects);
router.get('/:id', authenticationToken, getProjectById);
router.put('/:id', authenticationToken, updateProject);
router.delete('/:id', authenticationToken, deleteProject);
router.post('/:id/members', authenticationToken, addMember);

export default router;
