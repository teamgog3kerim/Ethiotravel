# Overview

Kerim VIP Tours is a full-stack web application for a premium Ethiopian travel services company. The application provides a complete booking system for VIP travel experiences including airport transfers, hotel assistance, city tours, halal dining, coffee ceremonies, and business/medical support. Built with React/TypeScript frontend, Express.js backend, PostgreSQL database via Drizzle ORM, and supports English/Arabic multilingual interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern component-based UI using React 18 with TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Shadcn/UI Components**: Consistent design system using Radix UI primitives with Tailwind CSS styling
- **React Router (Wouter)**: Lightweight client-side routing for single-page application navigation
- **TanStack Query**: Server state management for API calls with caching and synchronization
- **React Hook Form**: Form handling with Zod validation for type-safe form submissions
- **Internationalization**: i18next integration supporting English and Arabic with RTL layout support

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging, error handling, and file uploads
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect for schema management
- **File Upload Handling**: Multer middleware for passport photo uploads with image validation
- **Email Integration**: Nodemailer for booking confirmations and communication
- **PDF Generation**: PDFKit for generating booking confirmations and receipts
- **Session Management**: Express session handling for user state management

## Database Design
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL for scalability
- **Schema Structure**: 
  - Users table for authentication (placeholder for future implementation)
  - Bookings table storing all booking details including payment status and file paths
  - Tourists table for managing multiple travelers per booking with relational integrity
- **Drizzle Migrations**: Schema versioning and migration management through drizzle-kit

## State Management
- **TanStack Query**: Centralized server state with optimistic updates and cache invalidation
- **React Context**: Local component state management for UI interactions
- **Form State**: React Hook Form with Zod schemas for client-side validation

## Styling System
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **CSS Variables**: Dynamic theming system supporting light/dark modes
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Component Variants**: Class Variance Authority for consistent component styling

## Authentication & Authorization
- **Placeholder Implementation**: Basic user schema defined but authentication not fully implemented
- **Session-based**: Prepared for cookie-based session management
- **Future Extension**: Ready for OAuth or JWT implementation

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Database Connection**: WebSocket-based connection using @neondatabase/serverless driver

## Email Services
- **Gmail SMTP**: Email delivery through Gmail's SMTP service with app password authentication
- **Nodemailer**: Email client library for transactional emails and booking confirmations

## File Storage
- **Local File System**: Passport photos stored locally in uploads directory
- **Multer**: File upload middleware with size and type restrictions (5MB, images only)

## Payment Processing
- **USDT Integration**: Cryptocurrency payment system with transaction ID tracking
- **Manual Confirmation**: Admin-based payment verification system

## UI Component Library
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Shadcn/UI**: Pre-built component library built on Radix with Tailwind styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins
- **Replit Integration**: Development environment optimization for Replit platform

## Internationalization
- **i18next**: Translation framework with namespace support
- **React i18next**: React bindings for seamless component integration
- **RTL Support**: Right-to-left layout support for Arabic language