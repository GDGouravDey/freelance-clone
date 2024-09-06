import express from 'express';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = 8001;

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pdfFilePath = join(__dirname, 'uploads/20481ed3e45d08c55d1358dbef65b835');

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

        const dataBuffer = fs.readFileSync(pdfFilePath);
        const data = await pdfParse(dataBuffer);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Generate a 2D array in the format of [{Domain: 'DOMAIN_NAME', Proficiency: '72'}, ...] to represent the domains candidate knows according to the resume and generate a proficiency value to determine skill between 0 to 100. Have only two fields - Domain and Proficiency. Just give me the array in the method specified, no need of JSON or any word of explanation. This is the resume data = " + data.text;

        const result = await model.generateContent(prompt);
        res.json({ extractedText: result.response.text() });
    } catch (error) {
        console.error('Error during PDF processing:', error);
        res.status(500).json({ message: 'Error processing PDF' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
