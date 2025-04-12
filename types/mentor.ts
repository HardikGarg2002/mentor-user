/**
 * Mentor Types
 * Types related to mentor profiles and capabilities
 */

// Pricing structure for mentor sessions
export interface MentorPricing {
  chat: number;
  video: number;
  call: number;
}

// Mentor experience entry
export interface MentorExperience {
  company: string;
  role: string;
  period: string;
}

// Mentor education entry
export interface MentorEducation {
  institution: string;
  degree: string;
  year: string;
}

// Complete mentor profile information
export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  image?: string;
  about: string;
  specialties: string[];
  experience: MentorExperience[];
  education: MentorEducation[];
  pricing: MentorPricing;
  rating?: number;
  reviewCount?: number;
}

// Minimal mentor information for listings
export interface MentorListItem {
  id: string;
  userId: string;
  name: string;
  title: string;
  image?: string;
  specialties: string[];
  pricing: MentorPricing;
  rating?: number;
  reviewCount?: number;
}

export interface MentorFilters {
  specialties?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}
