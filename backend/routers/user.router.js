import express from 'express';
import { login, Register, Userdetails } from '../controllers/user.controllers.js';

import {authenticationToken} from '../Middleware/auth.js'

const router = express.Router({ mergeParams: true });


router.post('/register', Register);
router.route('/login').post(login);
router.get('/showDetails/:id',authenticationToken, Userdetails);
export default router;
