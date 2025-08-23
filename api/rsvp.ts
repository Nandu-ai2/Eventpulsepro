import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../backend/storage';
import { insertRsvpSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validatedData = insertRsvpSchema.parse(req.body);
    const rsvp = await storage.createRsvp(validatedData);
    return res.json({ message: "RSVP recorded successfully", rsvp });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid RSVP data", details: error.errors });
    }
    console.error("Error creating RSVP:", error);
    return res.status(500).json({ error: "Failed to record RSVP" });
  }
}