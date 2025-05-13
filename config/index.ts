/**
 * Main configuration file for Aricious
 * Centralizes all variables, links and constants used across the application
 */

// Re-export all configurations
import * as Constants from "./constants";
import * as Theme from "./theme";

// Application metadata
export const APP = {
  NAME: "Aricious",
  VERSION: "0.1.0",
  DESCRIPTION: "Aricious platform",
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

// Authentication related
export const AUTH = {
  JWT_SECRET: process.env.NEXTAUTH_SECRET || "your-secret-key",
  JWT_EXPIRY: "30d",
  PROVIDERS: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  },
  ROUTES: {
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
};

// Database configurations
export const DATABASE = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/aricious",
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
};

// API endpoints and routes
export const API = {
  BASE_PATH: "/api",
  ENDPOINTS: {
    AUTH: "/api/auth",
    USERS: "/api/users",
    MENTORS: "/api/mentors",
    SESSIONS: "/api/sessions",
    PAYMENTS: "/api/payments",
  },
};

// Payment gateway config
export const PAYMENT = {
  RAZORPAY: {
    KEY_ID: process.env.RAZORPAY_KEY_ID || "",
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
    WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  },
  CURRENCY: "INR",
  DEFAULT_DESCRIPTION: "Payment for Aricious services",
};

// Video conferencing configurations
export const VIDEO = {
  DAILY: {
    API_KEY: process.env.DAILY_API_KEY || "",
    DOMAIN: process.env.DAILY_DOMAIN || "",
  },
  JITSI: {
    DOMAIN: process.env.JITSI_DOMAIN || "meet.jit.si",
  },
};

// Email configuration
export const EMAIL = {
  FROM: process.env.EMAIL_FROM || "no-reply@aricious.com",
  SMTP: {
    HOST: process.env.EMAIL_SERVER_HOST || "",
    PORT: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    USER: process.env.EMAIL_SERVER_USER || "",
    PASSWORD: process.env.EMAIL_SERVER_PASSWORD || "",
  },
  TEMPLATES: {
    WELCOME: "welcome",
    RESET_PASSWORD: "reset-password",
    VERIFICATION: "verification",
    SESSION_REMINDER: "session-reminder",
    SESSION_CONFIRMATION: "session-confirmation",
  },
};

// Date and time configurations
export const DATETIME = {
  DEFAULT_TIMEZONE: "Asia/Kolkata",
  DATE_FORMAT: "yyyy-MM-dd",
  TIME_FORMAT: "HH:mm:ss",
  DATETIME_FORMAT: "yyyy-MM-dd HH:mm:ss",
  DISPLAY_DATE_FORMAT: "dd MMM yyyy",
  DISPLAY_TIME_FORMAT: "hh:mm a",
};

// UI configuration
export const UI = {
  THEME: {
    DEFAULT: "light",
    AVAILABLE: ["light", "dark", "system"],
  },
  COLORS: Theme.COLORS,
  TYPOGRAPHY: Theme.TYPOGRAPHY,
  SPACING: Theme.SPACING,
  BREAKPOINTS: Theme.BREAKPOINTS,
  BORDER_RADIUS: Theme.BORDER_RADIUS,
  SHADOWS: Theme.SHADOWS,
  Z_INDEX: Theme.Z_INDEX,
  ANIMATION: Theme.ANIMATION,
};

// External links
export const LINKS = {
  SOCIAL: Constants.SOCIAL_LINKS,
  LEGAL: Constants.LEGAL_LINKS,
  SUPPORT: Constants.SUPPORT_LINKS,
  RESOURCES: Constants.RESOURCE_LINKS,
};

// Feature flags
export const FEATURES = {
  ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS === "true",
  ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS === "true",
  MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === "true",
  DEBUG_MODE: process.env.NODE_ENV === "development",
};

// Path constants for routing
export const PATHS = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  MENTORS: "/mentors",
  SESSIONS: "/sessions",
  SETTINGS: "/settings",
  ADMIN: "/admin",
};

// Re-export constants
export { Constants };
