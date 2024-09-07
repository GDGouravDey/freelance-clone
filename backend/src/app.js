import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import employeeRouter from './routes/employee.routes.js';
import freelanceRouter from './routes/freelanceOffer.routes.js';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api/v1/user', userRouter);
//http://localhost:8000/api/v1/user/register

app.use('/api/v1/employee', employeeRouter);
import resumeRouter from './routes/resume.routes.js';

app.use('/api/v1/resume', resumeRouter);
//http://localhost:8000/api/v1/resume/upload-resume

app.use('/api/v1/freelance', freelanceRouter);

import offerRouter from './routes/freelanceOffer.routes.js';

app.use('/api/v1/offer', offerRouter);
//http://localhost:8000/api/v1/offer/create-offer

import applicationRouter from './routes/application.routes.js';

app.use('/api/v1/application', applicationRouter);
//http://localhost:8000/api/v1/application/apply

import ratingRouter from './routes/rating.routes.js';

app.use('/api/v1/rating', ratingRouter);
//http://localhost:8000/api/v1/rating/rate

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pdfFilePath = join(__dirname, 'uploads/Resume-Sayan Das.pdf');

app.post('/api/v1/extract-skills', async (req, res) => {
    try {
        if (!fs.existsSync(pdfFilePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        const dataBuffer = fs.readFileSync(pdfFilePath);
        const data = await pdfParse(dataBuffer);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Extract all skills from this resume data and represent these Skills in the form of a 1D array, no need to mention type of skill just extract name of the skill and start generating from [ to ] : " + data.text;

        const result = await model.generateContent(prompt);
        res.json({ extractedText: result.response.text() });
    } catch (error) {
        console.error('Error during PDF processing:', error);
        res.status(500).json({ message: 'Error processing PDF' });
    }
});

app.post('/api/v1/resume-recommend', async (req, res) => {
    try {
        if (!fs.existsSync(pdfFilePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        const dataBuffer = fs.readFileSync(pdfFilePath);
        const data = await pdfParse(dataBuffer);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Give recommendations for this resume to be better in order to have better ATS Score and overall structure according to Resume Content. Also give an accurate depiction of Resume Score based on Overall Resume Structure and Content in the first line. Resume Score has to be between 0 and 100, make it have one decimal place. Give short points, exclude points related to Resume design. Resume score of 50 to 70 is Average, 70 to 90 is Strong and Above 90 is Excellent : " + data.text;

        const result = await model.generateContent(prompt);
        res.json({ extractedText: result.response.text() });
    } catch (error) {
        console.error('Error during PDF processing:', error);
        res.status(500).json({ message: 'Error processing PDF' });
    }
});

app.post('/api/v1/generate-chart-1', async (req, res) => {
    try {
        if (!fs.existsSync(pdfFilePath)) {
            return res.status(404).json({ message: 'File not found' });
        }
        console.log('Hello');
        

        const dataBuffer = fs.readFileSync(pdfFilePath);
        const data = await pdfParse(dataBuffer);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Generate a 2D array in the format of [{Domain: 'DOMAIN_NAME', Proficiency: '72'}, ...] to represent the domains candidate knows (like Frontend, Backend, Machine Learning, Data Analysis, etc.) according to the resume and generate a proficiency value to determine proficiency in the domain between 0 to 100. Do not have an Individiual skill as a Domain. Have only two fields - Domain and Proficiency. Just give me the array in the method specified, no need of JSON or any word of explanation. This is the resume data = " + data.text;

        const result = await model.generateContent(prompt);
        res.json({ extractedText: result.response.text() });
    } catch (error) {
        console.error('Error during PDF processing:', error);
        res.status(500).json({ message: 'Error processing PDF' });
    }
});


export { app };