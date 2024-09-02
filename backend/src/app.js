import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

app.use(express.json({ limit: "10kb" }));  // body-parser

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser()); 
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

import userRouter from './routes/user.routes.js';

app.use('/api/v1/user', userRouter);
//http://localhost:8000/api/v1/user/register

import resumeRouter from './routes/resume.routes.js';

app.use('/api/v1/resume', resumeRouter);
//http://localhost:8000/api/v1/resume/upload-resume

import jobRouter from './routes/job.routes.js';

app.use('/api/v1/job', jobRouter);
//http://localhost:8000/api/v1/job/create-job

export { app };