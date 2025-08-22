# EventPulse - Event Discovery Platform

## Overview

EventPulse is a full-stack web application for discovering and managing events. Built with React, TypeScript, and Express, it provides a modern platform where users can browse events, filter by categories and preferences, and RSVP to events they're interested in. The application features a clean, responsive design with comprehensive event management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI built with React 18 and TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds with hot module replacement
- **Wouter Router**: Lightweight client-side routing for navigation
- **TanStack Query**: Powerful data fetching, caching, and synchronization for API interactions
- **Shadcn/ui Components**: Comprehensive UI component library built on Radix UI primitives with Tailwind CSS styling
- **Responsive Design**: Mobile-first approach using Tailwind CSS with custom design tokens

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Modular Route Structure**: Clean separation of concerns with dedicated route handlers
- **In-Memory Storage**: MemStorage class for development with sample data initialization
- **CORS Enabled**: Cross-origin resource sharing configured for frontend integration
- **Input Validation**: Zod schema validation for API requests

### Database Layer
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **PostgreSQL Ready**: Database schema defined with proper migrations support via Drizzle Kit
- **Neon Database**: Cloud PostgreSQL provider integration configured
- **Schema Design**: Normalized tables for events and RSVPs with proper relationships and constraints

### Authentication & Session Management
- **Session Infrastructure**: Express session middleware with PostgreSQL session store (connect-pg-simple)
- **User Identification**: UUID-based user tracking for RSVP functionality
- **Security Headers**: CORS and security middleware configured

### State Management
- **Client State**: React Query for server state management with optimistic updates
- **Local State**: React hooks for component-level state management
- **Form Handling**: React Hook Form with Zod resolvers for type-safe form validation

### UI/UX Features
- **Advanced Filtering**: Multi-criteria filtering by category, date, price, and location
- **Search Functionality**: Real-time event search with debounced input
- **Modal Interactions**: Event details and RSVP functionality in modal overlays
- **Toast Notifications**: User feedback system for actions and errors
- **Loading States**: Skeleton loading and spinner components for better UX

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Database operations and migrations

### UI Framework & Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating component variants

### Development & Build Tools
- **Vite**: Frontend build tool and development server
- **TSX**: TypeScript execution for server development
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment optimizations

### API & Data Management
- **TanStack Query**: Server state management and caching
- **Date-fns**: Date manipulation and formatting utilities
- **React Hook Form**: Form state management and validation

### Development Environment
- **TypeScript**: Static type checking across the entire application
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Wouter**: Lightweight routing solution for React applications