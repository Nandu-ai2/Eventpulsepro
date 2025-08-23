import { type Event, type InsertEvent, type Rsvp, type InsertRsvp, events, rsvps } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // RSVP operations
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getRsvpsByEventId(eventId: number): Promise<Rsvp[]>;
  getRsvpByEventAndUser(eventId: number, userId: string): Promise<Rsvp | undefined>;
  updateRsvp(eventId: number, userId: string, status: string): Promise<Rsvp>;
}

export class DatabaseStorage implements IStorage {
  async getAllEvents(): Promise<Event[]> {
    const result = await db.select().from(events).orderBy(events.date);
    return result;
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(eventData)
      .returning();
    return event;
  }

  async createRsvp(rsvpData: InsertRsvp): Promise<Rsvp> {
    // Check if RSVP already exists
    const existing = await this.getRsvpByEventAndUser(rsvpData.eventId, rsvpData.userId);
    
    if (existing) {
      return this.updateRsvp(rsvpData.eventId, rsvpData.userId, rsvpData.status);
    }

    const [rsvp] = await db
      .insert(rsvps)
      .values(rsvpData)
      .returning();
    return rsvp;
  }

  async getRsvpsByEventId(eventId: number): Promise<Rsvp[]> {
    const result = await db.select().from(rsvps).where(eq(rsvps.eventId, eventId));
    return result;
  }

  async getRsvpByEventAndUser(eventId: number, userId: string): Promise<Rsvp | undefined> {
    const [rsvp] = await db
      .select()
      .from(rsvps)
      .where(and(eq(rsvps.eventId, eventId), eq(rsvps.userId, userId)));
    return rsvp || undefined;
  }

  async updateRsvp(eventId: number, userId: string, status: string): Promise<Rsvp> {
    const [rsvp] = await db
      .update(rsvps)
      .set({ status })
      .where(and(eq(rsvps.eventId, eventId), eq(rsvps.userId, userId)))
      .returning();
    
    if (!rsvp) {
      return this.createRsvp({ eventId, userId, status });
    }
    
    return rsvp;
  }
}

export const storage = new DatabaseStorage();
