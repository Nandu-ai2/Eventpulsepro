import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, serial, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  imageUrl: text("image_url"),
  organizer: varchar("organizer", { length: 255 }).notNull(),
  attendees: integer("attendees").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'going', 'maybe', 'not-going'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueEventUser: unique().on(table.eventId, table.userId),
}));

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  attendees: true,
});

export const insertRsvpSchema = createInsertSchema(rsvps).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;
