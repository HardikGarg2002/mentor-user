/**
 * Environment Variables Reference
 *
 * This file documents all environment variables used in the application.
 * Create a .env file based on this template.
 */

export const ENV_REFERENCE = {
  // Application
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NODE_ENV: "development",

  // Authentication
  NEXTAUTH_SECRET: "your-secret-key",
  NEXTAUTH_URL: "http://localhost:3000",

  // Google OAuth
  GOOGLE_CLIENT_ID: "",
  GOOGLE_CLIENT_SECRET: "",

  // MongoDB
  MONGODB_URI: "mongodb://localhost:27017/aricious",

  // Email
  EMAIL_FROM: "no-reply@aricious.com",
  EMAIL_SERVER_HOST: "",
  EMAIL_SERVER_PORT: "587",
  EMAIL_SERVER_USER: "",
  EMAIL_SERVER_PASSWORD: "",

  // Payment
  RAZORPAY_KEY_ID: "",
  RAZORPAY_KEY_SECRET: "",
  RAZORPAY_WEBHOOK_SECRET: "",

  // Video Conferencing
  DAILY_API_KEY: "",
  DAILY_DOMAIN: "",
  JITSI_DOMAIN: "meet.jit.si",

  // Feature Flags
  ENABLE_PAYMENTS: "false",
  ENABLE_NOTIFICATIONS: "true",
  MAINTENANCE_MODE: "false",
};

// Instructions for setting up environment variables
export const SETUP_INSTRUCTIONS = `
1. Create a .env file in the root directory
2. Copy the variables from this file and set their values
3. Never commit the actual .env file to the repository
4. For deployment, set these variables in your hosting environment
`;
