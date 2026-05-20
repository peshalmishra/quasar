import USER from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Task from '../models/task.js';

export const Register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exitUser = await USER.findOne({ email });
        if (exitUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        const newUser = new USER({
            name,
            email,
            password: hashpassword,
            role: role === 'admin' ? 'admin' : 'member',
        });

        await newUser.save();

        const userResponse = {
            _id: newUser._id,
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        };

        res.status(201).json({
            user: userResponse,
            message: "User registered successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existUser = await USER.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ message: "Email not exists" });
        }
        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password entered" });
        }

        const token = jwt.sign(
            { email: existUser.email, id: existUser._id, role: existUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const lastProject = await Task.findOne({ user: existUser._id }).sort({ createdAt: -1 });
        const userResponse = {
            _id: existUser._id,
            id: existUser._id,
            name: existUser.name,
            email: existUser.email,
            role: existUser.role,
        };

        res.status(200).json({
            token,
            user: userResponse,
            lastProject,
            message: "User login successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const Userdetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await USER.findById(id).select('name email role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};