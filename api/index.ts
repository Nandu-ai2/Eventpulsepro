import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../backend/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

let server: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    server = await registerRoutes(app);
  }
  
  return app(req, res);
}