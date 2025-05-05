"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import { z } from "zod";
import type { MentorProfile } from "@/types/mentor";

// Define validation schema for mentor application
const mentorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  about: z
    .string()
    .min(50, "Please provide a detailed description (at least 50 characters)"),
  specialties: z.string().transform((val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  ),
  experience: z
    .array(
      z.object({
        company: z.string().min(1, "Company name is required"),
        role: z.string().min(1, "Role is required"),
        period: z.string().min(1, "Period is required"),
      })
    )
    .min(1, "At least one experience entry is required"),
  education: z
    .array(
      z.object({
        institution: z.string().min(1, "Institution name is required"),
        degree: z.string().min(1, "Degree is required"),
        year: z.string().min(1, "Year is required"),
      })
    )
    .min(1, "At least one education entry is required"),
  pricing: z.object({
    chat: z.coerce.number().min(1, "Chat price is required"),
    video: z.coerce.number().min(1, "Video price is required"),
    call: z.coerce.number().min(1, "Call price is required"),
  }),
});

export type MentorFormData = z.infer<typeof mentorSchema>;

export async function createMentor(formData: MentorFormData) {
  try {
    // Validate form data
    const validatedData = mentorSchema.parse(formData);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: "mentor", // Set role to mentor
    });

    const savedUser = await newUser.save();

    // Create mentor profile
    const newMentor = new Mentor({
      userId: savedUser._id,
      title: validatedData.title,
      about: validatedData.about,
      specialties: validatedData.specialties,
      experience: validatedData.experience,
      education: validatedData.education,
      pricing: validatedData.pricing,
      availability: [], // Empty availability initially
      rating: 0,
      reviewCount: 0,
    });

    await newMentor.save();

    revalidatePath("/mentors");
    revalidatePath("/auth/signup/become-mentor");

    return {
      success: true,
      message:
        "Mentor application submitted successfully! You can now sign in with your credentials.",
    };
  } catch (error) {
    console.error("Error creating mentor:", error);

    if (error instanceof z.ZodError) {
      // Return validation errors
      const fieldErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    return {
      success: false,
      error: "Failed to create mentor profile. Please try again.",
    };
  }
}

export async function getMentorProfile(
  userId: string
): Promise<MentorProfile | null> {
  try {
    await connectDB();
    const user = await User.findOne({ _id: userId });
    const mentor = await Mentor.findOne({ userId }).lean();

    if (!mentor) {
      return null;
    }

    return {
      id: mentor._id.toString(),
      userId: mentor.userId.toString(),
      name: user?.name || "",
      image: user?.image,
      title: mentor.title,
      about: mentor.about,
      specialties: mentor.specialties,
      experience: mentor.experience,
      education: mentor.education,
      pricing: mentor.pricing,
      rating: mentor.rating,
      reviewCount: mentor.reviewCount,
    };
  } catch (error) {
    console.error("Failed to fetch mentor profile:", error);
    throw new Error("Failed to fetch mentor profile");
  }
}

export async function updateMentorProfile(
  userId: string,
  data: Partial<MentorProfile>
) {
  try {
    await connectDB();

    const { id, name, ...updateData } = data;

    const mentor = await Mentor.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    revalidatePath("/profile");
    return mentor;
  } catch (error) {
    console.error("Failed to update mentor profile:", error);
    throw new Error("Failed to update mentor profile");
  }
}

export async function createMentorProfile(
  userId: string,
  data: Omit<MentorProfile, "id" | "rating" | "reviewCount">
) {
  try {
    await connectDB();

    const existingMentor = await Mentor.findOne({ userId });
    if (existingMentor) {
      throw new Error("Mentor profile already exists");
    }

    const { name, ...mentorData } = data;
    const mentor = await Mentor.create({
      userId,
      ...mentorData,
    });

    revalidatePath("/profile");
    return mentor;
  } catch (error) {
    console.error("Failed to create mentor profile:", error);
    throw new Error("Failed to create mentor profile");
  }
}

export async function updateMentorProfileImage(
  userId: string,
  imageUrl: string
) {
  try {
    await connectDB();

    // Update only the user's image
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { image: imageUrl } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile image:", error);
    throw new Error("Failed to update profile image");
  }
}
