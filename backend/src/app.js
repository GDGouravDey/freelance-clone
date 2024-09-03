import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
// import resumeRouter from './routes/resume.routes.js';
// import jobRouter from './routes/job.routes.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api/v1/user', userRouter);
//http://localhost:8000/api/v1/user/register

// app.use('/api/v1/resume', resumeRouter);
//http://localhost:8000/api/v1/resume/upload-resume

// app.use('/api/v1/job', jobRouter);
//http://localhost:8000/api/v1/job/create-job

export { app };