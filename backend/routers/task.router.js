import express from 'express';
import {
    addTask,
    deleteTask,
    editTask,
    showone,
    showTask,
    updateTaskStatus,
    uploadAttachment,
    deleteAttachment,
    getTasksByProject,
} from '../controllers/task.controllers.js';
import { authenticationToken } from '../Middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/addtask', authenticationToken, addTask);
router.put('/edittask/:id', authenticationToken, editTask);
router.patch('/status/:id', authenticationToken, updateTaskStatus);
router.delete('/deleteTask/:id', authenticationToken, deleteTask);
router.get('/showTask/:id', authenticationToken, showTask);
router.get('/showOne/:id/:projectId', authenticationToken, showone);
router.get('/byProject/:projectId', authenticationToken, getTasksByProject);
router.post('/upload/:id', authenticationToken, uploadAttachment);
router.delete('/:id/attachment/:attachmentId', authenticationToken, deleteAttachment);

export default router;