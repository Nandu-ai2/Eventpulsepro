import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../backend/storage';
import { insertUserSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const users = await storage.getAllUsers();
      return res.json(users);
    }

    if (req.method === 'POST') {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      return res.status(201).json({ message: "User created successfully", user });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    console.error("Error in users API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}