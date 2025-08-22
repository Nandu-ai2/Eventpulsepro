import express from 'express';
import cors from 'cors';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Postgres connection with SSL for Supabase
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());

// Get all events
app.get('/events', async (req, res) => {
  try {
    // You can adjust columns and table name as per your DB schema
    const events = await sql`
      SELECT * FROM events ORDER BY date ASC LIMIT 100;
    `;
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RSVP submission endpoint
app.post('/rsvp', async (req, res) => {
  const { event_id, user_id, status } = req.body;

  if (!event_id || !user_id || !status) {
    return res.status(400).json({ error: 'Missing event_id, user_id, or status' });
  }

  try {
    await sql`
      INSERT INTO rsvps (event_id, user_id, status)
      VALUES (${event_id}, ${user_id}, ${status})
      ON CONFLICT (event_id, user_id) DO UPDATE SET status = EXCLUDED.status;
    `;
    res.json({ message: 'RSVP recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
