// import { Router } from "express";
import express from 'express';
import {addTask, deleteTask, editTask, showone, showTask} from'../controllers/task.controllers.js';
import { authenticationToken } from '../Middleware/auth.js';
const router = express.Router({mergeParams:true});

router.route('/addtask').post(authenticationToken,addTask);
router.route('/edittask/:id').put(authenticationToken,editTask);
router.route('/deleteTask/:id').delete(authenticationToken,deleteTask);
router.route('/showTask/:id').get(authenticationToken,showTask);
router.route('/showOne/:id/:projectId').get(authenticationToken,showone);
// router.get('/',(req,res)=>{
//     res.send('Task');
// })
export default router;