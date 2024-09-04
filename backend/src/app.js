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

import offerRouter from './routes/freelanceOffer.routes.js';

app.use('/api/v1/offer', offerRouter);
//http://localhost:8000/api/v1/offer/create-offer

import applicationRouter from './routes/application.routes.js';

app.use('/api/v1/application', applicationRouter);
//http://localhost:8000/api/v1/application/apply

import ratingRouter from './routes/rating.routes.js';

app.use('/api/v1/rating', ratingRouter);
//http://localhost:8000/api/v1/rating/rate

export { app };