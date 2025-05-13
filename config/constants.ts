/**
 * Application Constants
 *
 * This file contains all the constant values used throughout the application.
 * These values are not configurable through environment variables.
 */

// Application roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MENTOR: "mentor",
};

// User account status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING_VERIFICATION: "pending_verification",
};

// Session status
export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
  IN_PROGRESS: "in_progress",
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
};

// Notification types
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: "session_reminder",
  SESSION_CANCELLED: "session_cancelled",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILURE: "payment_failure",
  SYSTEM_ANNOUNCEMENT: "system_announcement",
  NEW_MESSAGE: "new_message",
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LAST_VIEWED_MENTORS: "last_viewed_mentors",
};

// API response status codes and messages
export const API_RESPONSES = {
  SUCCESS: {
    CODE: 200,
    MESSAGE: "Success",
  },
  CREATED: {
    CODE: 201,
    MESSAGE: "Resource created successfully",
  },
  BAD_REQUEST: {
    CODE: 400,
    MESSAGE: "Bad request",
  },
  UNAUTHORIZED: {
    CODE: 401,
    MESSAGE: "Unauthorized access",
  },
  FORBIDDEN: {
    CODE: 403,
    MESSAGE: "Access forbidden",
  },
  NOT_FOUND: {
    CODE: 404,
    MESSAGE: "Resource not found",
  },
  SERVER_ERROR: {
    CODE: 500,
    MESSAGE: "Internal server error",
  },
};

// Form validation related constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]{3,20}$/,
  PHONE_REGEX: /^\+?[0-9]{10,15}$/,
};

// Time constants
export const TIME = {
  MILLISECONDS_IN_SECOND: 1000,
  SECONDS_IN_MINUTE: 60,
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  DAYS_IN_WEEK: 7,
};

// Session duration options (in minutes)
export const SESSION_DURATIONS = [15, 30, 45, 60, 90, 120];

// Default pagination limits
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Application error codes
export const ERROR_CODES = {
  AUTH_FAILED: "auth_failed",
  INVALID_CREDENTIALS: "invalid_credentials",
  USER_NOT_FOUND: "user_not_found",
  SESSION_NOT_FOUND: "session_not_found",
  PAYMENT_FAILED: "payment_failed",
  DATABASE_ERROR: "database_error",
  VALIDATION_ERROR: "validation_error",
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
  NOT_FOUND: "not_found",
};

// Feedback rating levels
export const RATING_LEVELS = {
  POOR: 1,
  FAIR: 2,
  GOOD: 3,
  VERY_GOOD: 4,
  EXCELLENT: 5,
};

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: "https://x.com/ARicious_",
  TWITTER_HANDLE: "@aricious",
  FACEBOOK: "https://facebook.com/aricious",
  INSTAGRAM: "https://www.instagram.com/aricious__?igsh=MW9rcGw5Z254NXcyOA==",
  INSTAGRAM_HANDLE: "@aricious__",
  LINKEDIN: "http://www.linkedin.com/in/aricious-9183a0365",
  GITHUB: "https://github.com/aricious",
  YOUTUBE: "https://youtube.com/@aricious?si=mNJEzv4JhNB2GqtI",
};

// Legal and policy links
export const LEGAL_LINKS = {
  TERMS: "/legal/terms",
  PRIVACY: "/legal/privacy",
  COOKIES: "/legal/cookies",
  COPYRIGHT: "/legal/copyright",
  DISCLAIMER: "/legal/disclaimer",
};

// Support and help links
export const SUPPORT_LINKS = {
  HELP_CENTER: "/support",
  CONTACT: "/contact",
  FAQ: "/faq",
  FEEDBACK: "/feedback",
  REPORT_ISSUE: "/report-issue",
};

// Blog and resource links
export const RESOURCE_LINKS = {
  BLOG: "/blog",
  RESOURCES: "/resources",
  GUIDES: "/guides",
  COMMUNITY: "/community",
};
