import express from 'express';
import main from './db.js';
import taskRouter from './routers/task.router.js';
import userRouter from './routers/user.router.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();


const corsOptions = {
    origin: [
        'http://localhost:4173', // Docker served frontend (serve)
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000', // fallback
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 4000;

app.use('/Task', taskRouter);
app.use('/User', userRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
    try {
        await main();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server due to MongoDB connection error');
        process.exit(1);
    }
};

startServer();
