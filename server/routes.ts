import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "teamgog3@gmail.com",
    pass: process.env.SMTP_PASSWORD || "your-app-password",
  },
});

// Pricing logic
const pricing = {
  1: 500,
  2: 600,
  3: 900,
  4: 1200,
  5: 1400,
  6: 1600,
};

function generateBookingPDF(booking: any, language: string = "en"): Buffer {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];
  
  doc.on("data", buffers.push.bind(buffers));
  
  const isArabic = language === "ar";
  
  // Header
  doc.fontSize(20).text(isArabic ? "تأكيد الحجز - كيريم VIP Tours" : "Booking Confirmation - Kerim VIP Tours", { align: "center" });
  doc.moveDown();
  
  // Tourist Details
  doc.fontSize(16).text(isArabic ? "تفاصيل السائح:" : "Tourist Details:");
  doc.fontSize(12);
  doc.text(`${isArabic ? "الاسم الكامل:" : "Full Name:"} ${booking.fullName}`);
  doc.text(`${isArabic ? "البريد الإلكتروني:" : "Email:"} ${booking.email}`);
  doc.text(`${isArabic ? "عدد المسافرين:" : "Number of Travelers:"} ${booking.numberOfPersons}`);
  doc.text(`${isArabic ? "الغرض:" : "Purpose:"} ${booking.travelPurpose}`);
  doc.text(`${isArabic ? "تفضيل الفندق:" : "Hotel Preference:"} ${booking.hotelPreference}`);
  doc.text(`${isArabic ? "تاريخ الوصول:" : "Arrival Date:"} ${booking.arrivalDate}`);
  doc.text(`${isArabic ? "تاريخ المغادرة:" : "Departure Date:"} ${booking.departureDate}`);
  doc.moveDown();
  
  // Payment Info
  doc.fontSize(16).text(isArabic ? "معلومات الدفع:" : "Payment Info:");
  doc.fontSize(12);
  doc.text(`${isArabic ? "الباقة:" : "Package:"} VIP Ethiopia Tour`);
  doc.text(`${isArabic ? "إجمالي USDT:" : "Total USDT:"} $${booking.totalAmount}`);
  doc.text(`${isArabic ? "حالة الدفع:" : "Payment Status:"} ${booking.paymentStatus}`);
  doc.text(`${isArabic ? "عنوان المحفظة:" : "Wallet Address:"} TKhpVbVKLkdpQEBTJaRhwNxWTgZ2vWQBSk`);
  if (booking.transactionId) {
    doc.text(`${isArabic ? "معرف المعاملة:" : "Transaction ID:"} ${booking.transactionId}`);
  }
  doc.moveDown();
  
  // Services
  doc.fontSize(16).text(isArabic ? "الخدمات:" : "Services:");
  doc.fontSize(12);
  const services = [
    isArabic ? "خدمة التوصيل من وإلى المطار" : "Airport Pickup & Drop",
    isArabic ? "مساعدة حجز الفندق" : "Hotel Booking Assistance", 
    isArabic ? "جولات مدينة أديس أبابا" : "Addis Ababa City Tours",
    isArabic ? "المطاعم الحلال" : "Halal Restaurants",
    isArabic ? "حفل القهوة الإثيوبية" : "Ethiopian Coffee Ceremony",
    isArabic ? "المساعدة التجارية/الطبية" : "Business/Medical Assistance"
  ];
  
  services.forEach(service => {
    doc.text(`• ${service}`);
  });
  
  doc.moveDown();
  
  // Footer
  doc.fontSize(10).text(
    isArabic 
      ? "شكرًا لاختيارك كيريم VIP Tours. هذا التأكيد صالح فقط بعد استلام الدفع الكامل بعملة USDT.\nالبريد الإلكتروني: teamgog3@gmail.com"
      : "Thank you for choosing Kerim VIP Tours. This confirmation is valid only after full USDT payment is received.\nEMAIL: teamgog3@gmail.com",
    { align: "center" }
  );
  
  doc.end();
  
  return Buffer.concat(buffers);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const allBookings = await storage.getBookings();
      res.json(allBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get single booking
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Create booking with file upload
  app.post("/api/bookings", upload.single("passportPhoto"), async (req, res) => {
    try {
      const bookingData = {
        ...req.body,
        numberOfPersons: parseInt(req.body.numberOfPersons),
        totalAmount: pricing[parseInt(req.body.numberOfPersons) as keyof typeof pricing] || 0,
        passportPhotoPath: req.file?.path,
      };

      // Validate duration (max 20 days)
      const arrivalDate = new Date(bookingData.arrivalDate);
      const departureDate = new Date(bookingData.departureDate);
      const diffTime = Math.abs(departureDate.getTime() - arrivalDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 20) {
        return res.status(400).json({ message: "Maximum duration is 20 days" });
      }

      const validatedData = insertBookingSchema.parse(bookingData);
      const newBooking = await storage.createBooking(validatedData);

      // Send confirmation email
      const language = req.body.language || "en";
      const pdfBuffer = generateBookingPDF(newBooking, language);
      
      const subject = language === "ar" 
        ? "تأكيد حجز جولات كيريم VIP"
        : "Kerim VIP Tours Booking Confirmation";
        
      const text = language === "ar"
        ? "شكرًا لحجزك مع كيريم VIP Tours. يرجى العثور على تأكيد الحجز المرفق."
        : "Thank you for booking with Kerim VIP Tours. Please find your booking confirmation attached.";

      await transporter.sendMail({
        from: process.env.SMTP_USER || "teamgog3@gmail.com",
        to: newBooking.email,
        subject,
        text,
        attachments: [{
          filename: "booking-confirmation.pdf",
          content: pdfBuffer,
        }],
      });

      res.status(201).json(newBooking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      console.error("Booking creation error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Update payment status
  app.patch("/api/bookings/:id/payment", async (req, res) => {
    try {
      const { transactionId, status } = req.body;
      
      if (!transactionId || !status) {
        return res.status(400).json({ message: "Transaction ID and status are required" });
      }

      const updatedBooking = await storage.updateBookingPayment(req.params.id, transactionId, status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  // Get dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const allBookings = await storage.getBookings();
      const activeTourists = await storage.getActiveTourists();
      
      const totalBookings = allBookings.length;
      const totalRevenue = allBookings
        .filter(b => b.paymentStatus === "confirmed")
        .reduce((sum, b) => sum + b.totalAmount, 0);
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthBookings = allBookings.filter(
        b => new Date(b.createdAt!) >= thisMonth
      ).length;

      res.json({
        totalBookings,
        activeTourists: activeTourists.length,
        totalRevenue,
        thisMonthBookings,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Export bookings as PDF
  app.get("/api/bookings/export/pdf", async (req, res) => {
    try {
      const allBookings = await storage.getBookings();
      
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=bookings.pdf");
      
      doc.pipe(res);
      
      doc.fontSize(20).text("Kerim VIP Tours - Bookings Report", { align: "center" });
      doc.moveDown();
      
      allBookings.forEach((booking, index) => {
        doc.fontSize(12);
        doc.text(`${index + 1}. ${booking.fullName} - ${booking.email}`);
        doc.text(`   Travelers: ${booking.numberOfPersons}, Amount: $${booking.totalAmount}`);
        doc.text(`   Status: ${booking.paymentStatus}, Dates: ${booking.arrivalDate} to ${booking.departureDate}`);
        doc.moveDown();
      });
      
      doc.end();
    } catch (error) {
      res.status(500).json({ message: "Failed to export PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
