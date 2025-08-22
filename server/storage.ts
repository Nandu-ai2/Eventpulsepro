import { type Event, type InsertEvent, type Rsvp, type InsertRsvp, events, rsvps } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private events: Map<number, Event>;
  private rsvps: Map<number, Rsvp>;
  private eventIdCounter: number = 1;
  private rsvpIdCounter: number = 1;

  constructor() {
    this.events = new Map();
    this.rsvps = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleEvents: Event[] = [
      {
        id: 1,
        title: "Tech Meetup: AI & Machine Learning",
        description: "Join us for an exciting discussion about the latest trends in AI and machine learning. Industry experts will share insights and experiences.",
        date: new Date("2024-02-15T18:00:00"),
        location: "San Francisco, CA",
        category: "technology",
        price: "0",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        organizer: "SF Tech Community",
        attendees: 156,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Startup Pitch Night",
        description: "Watch innovative startups pitch their ideas to investors and industry leaders. Network with entrepreneurs and potential collaborators.",
        date: new Date("2024-02-18T19:00:00"),
        location: "New York, NY",
        category: "business",
        price: "25.00",
        imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        organizer: "NYC Startup Hub",
        attendees: 89,
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Yoga in the Park",
        description: "Start your weekend with a refreshing yoga session in the beautiful Golden Gate Park. All levels welcome!",
        date: new Date("2024-02-17T08:00:00"),
        location: "San Francisco, CA",
        category: "health",
        price: "0",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        organizer: "SF Wellness Group",
        attendees: 45,
        createdAt: new Date(),
      },
      {
        id: 4,
        title: "Basketball Tournament",
        description: "Join our monthly basketball tournament! Teams of all skill levels welcome. Prizes for winners and great fun for everyone.",
        date: new Date("2024-02-20T14:00:00"),
        location: "Los Angeles, CA",
        category: "sports",
        price: "15.00",
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        organizer: "LA Sports League",
        attendees: 78,
        createdAt: new Date(),
      },
      {
        id: 5,
        title: "Art Gallery Opening",
        description: "Celebrate the opening of our new contemporary art exhibition featuring local artists. Wine and appetizers included.",
        date: new Date("2024-02-19T18:30:00"),
        location: "Chicago, IL",
        category: "arts",
        price: "0",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        organizer: "Chicago Art Collective",
        attendees: 234,
        createdAt: new Date(),
      },
      {
        id: 6,
        title: "Live Jazz Night",
        description: "Experience the best of live jazz music with renowned musicians. Enjoy great music, cocktails, and atmosphere.",
        date: new Date("2024-02-16T20:00:00"),
        location: "New York, NY",
        category: "music",
        price: "35.00",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        organizer: "Blue Note NYC",
        attendees: 167,
        createdAt: new Date(),
      }
    ];

    sampleEvents.forEach(event => {
      this.events.set(event.id, event);
      this.eventIdCounter = Math.max(this.eventIdCounter, event.id + 1);
    });
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = {
      ...eventData,
      id,
      attendees: 0,
      createdAt: new Date(),
      description: eventData.description || null,
      price: eventData.price || "0",
      imageUrl: eventData.imageUrl || null,
    };
    this.events.set(id, event);
    return event;
  }

  async createRsvp(rsvpData: InsertRsvp): Promise<Rsvp> {
    // Check if RSVP already exists
    const existing = Array.from(this.rsvps.values()).find(
      rsvp => rsvp.eventId === rsvpData.eventId && rsvp.userId === rsvpData.userId
    );
    
    if (existing) {
      return this.updateRsvp(rsvpData.eventId, rsvpData.userId, rsvpData.status);
    }

    const id = this.rsvpIdCounter++;
    const rsvp: Rsvp = {
      ...rsvpData,
      id,
      createdAt: new Date(),
    };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }

  async getRsvpsByEventId(eventId: number): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).filter(rsvp => rsvp.eventId === eventId);
  }

  async getRsvpByEventAndUser(eventId: number, userId: string): Promise<Rsvp | undefined> {
    return Array.from(this.rsvps.values()).find(
      rsvp => rsvp.eventId === eventId && rsvp.userId === userId
    );
  }

  async updateRsvp(eventId: number, userId: string, status: string): Promise<Rsvp> {
    const existing = await this.getRsvpByEventAndUser(eventId, userId);
    if (existing) {
      existing.status = status;
      this.rsvps.set(existing.id, existing);
      return existing;
    }
    
    return this.createRsvp({ eventId, userId, status });
  }
}

export const storage = new MemStorage();
