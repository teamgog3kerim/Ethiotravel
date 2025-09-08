import { bookings, tourists, type User, type InsertUser, type Booking, type InsertBooking, type Tourist, type InsertTourist } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookings(): Promise<Booking[]>;
  updateBookingPayment(id: string, transactionId: string, status: string): Promise<Booking | undefined>;
  
  // Tourist methods
  createTourist(tourist: InsertTourist): Promise<Tourist>;
  getTouristsByBooking(bookingId: string): Promise<Tourist[]>;
  getActiveTourists(): Promise<Tourist[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    // Mock user for now since we don't have user management yet
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Mock user for now since we don't have user management yet
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Mock user creation for now
    const user: User = { ...insertUser, id: randomUUID() };
    return user;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async updateBookingPayment(id: string, transactionId: string, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        transactionId, 
        paymentStatus: status,
        updatedAt: new Date()
      })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  async createTourist(tourist: InsertTourist): Promise<Tourist> {
    const [newTourist] = await db
      .insert(tourists)
      .values(tourist)
      .returning();
    return newTourist;
  }

  async getTouristsByBooking(bookingId: string): Promise<Tourist[]> {
    return await db.select().from(tourists).where(eq(tourists.bookingId, bookingId));
  }

  async getActiveTourists(): Promise<Tourist[]> {
    return await db.select().from(tourists).where(eq(tourists.isActive, true));
  }
}

export const storage = new DatabaseStorage();
