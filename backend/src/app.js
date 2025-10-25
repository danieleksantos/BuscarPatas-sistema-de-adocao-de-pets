import dotenv from 'dotenv'; 
dotenv.config();

import express from 'express';
import cors from 'cors';

// Importação das rotas
import authRoutes from './routes/authRoutes.js'; 
import petRoutes from './routes/petRoutes.js';
import adotanteRoutes from './routes/adotanteRoutes.js'; 
import adocaoRoutes from './routes/adocaoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import passport from './config/passport.js'; 
import dashboardRoutes from './routes/dashboardRoutes.js';


const app = express();


const PRODUCTION_URL_HARDCODE = 'https://buscar-patas-sistema-de-adocao-de-p.vercel.app';


const ENV_ALLOWED_URLS = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : [];

// O nome do seu projeto no Vercel (base para o Regex de previews)
const VERCEL_PROJECT_NAME = 'buscar-patas-sistema-de-adocao-de-pets';

// REGEX: Permite qualquer link de "preview" do Vercel (Resolve o link que está funcionando)
const VERCEL_PREVIEW_REGEX = new RegExp(`^https://${VERCEL_PROJECT_NAME}-.*\\.vercel\\.app$`);


const allowedOrigins = [
    ...ENV_ALLOWED_URLS, 
    PRODUCTION_URL_HARDCODE,
    VERCEL_PREVIEW_REGEX 
];

app.use(cors({
    origin: allowedOrigins, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204
}));


app.use(express.json());
app.use(passport.initialize());

// Rotas
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/profile', profileRoutes);
app.use('/pets', petRoutes);
app.use('/adotantes', adotanteRoutes); 
app.use('/adocoes', adocaoRoutes);
app.use('/dashboard', dashboardRoutes);

export default app;
