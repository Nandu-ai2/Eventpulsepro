// Vercel serverless function entry point
import express from 'express';
import { registerRoutes } from '../server/routes';

// Define types for Vercel
interface VercelRequest {
  query: any;
  body: any;
  url?: string;
  method?: string;
  headers: any;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (obj: any) => VercelResponse;
  send: (body: any) => VercelResponse;
  header: (key: string, value: string) => VercelResponse;
  sendStatus: (code: number) => VercelResponse;
}

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

// Setup routes
let routesRegistered = false;
let server: any;

const setupRoutes = async () => {
  if (!routesRegistered) {
    server = await registerRoutes(app);
    routesRegistered = true;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await setupRoutes();
  
  // Create a mock server object for Vercel
  const mockReq = {
    ...req,
    url: req.url || '/',
    method: req.method || 'GET',
  };
  
  return app(mockReq as any, res as any);
}