import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  passportPhotoPath: text("passport_photo_path"),
  numberOfPersons: integer("number_of_persons").notNull(),
  hotelPreference: text("hotel_preference").notNull(),
  arrivalDate: text("arrival_date").notNull(),
  departureDate: text("departure_date").notNull(),
  travelPurpose: text("travel_purpose").notNull(),
  specialRequests: text("special_requests"),
  totalAmount: integer("total_amount").notNull(), // in USDT
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, confirmed, failed
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tourists = pgTable("tourists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  name: text("name").notNull(),
  passportNumber: text("passport_number"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookingsRelations = relations(bookings, ({ many }) => ({
  tourists: many(tourists),
}));

export const touristsRelations = relations(tourists, ({ one }) => ({
  booking: one(bookings, {
    fields: [tourists.bookingId],
    references: [bookings.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  arrivalDate: z.string().min(1, "Arrival date is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  numberOfPersons: z.number().min(1).max(6),
  totalAmount: z.number().min(500),
});

export const insertTouristSchema = createInsertSchema(tourists).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Tourist = typeof tourists.$inferSelect;
export type InsertTourist = z.infer<typeof insertTouristSchema>;
