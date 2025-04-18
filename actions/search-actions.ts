"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import type { MentorProfile } from "@/types/mentor";

export async function searchMentors(query: string) {
  if (!query || query.trim() === "") {
    return [];
  }

  try {
    await connectDB();

    // Find mentors that match the query in name, title, about, or specialties
    const mentorDocs = await Mentor.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { about: { $regex: query, $options: "i" } },
        { specialties: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    // Get user information for each mentor
    const userIds = mentorDocs.map((mentor) => mentor.userId);
    const users = await User.find({
      _id: { $in: userIds },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    // Map users to mentors
    const mentors: MentorProfile[] = mentorDocs.map((mentor) => {
      const user = users.find(
        (u) => u._id.toString() === mentor.userId.toString()
      );

      return {
        id: mentor._id.toString(),
        userId: mentor.userId.toString(),
        name: user?.name || "Unknown",
        title: mentor.title,
        image: user?.image,
        about: mentor.about,
        specialties: mentor.specialties,
        experience: mentor.experience,
        education: mentor.education,
        pricing: mentor.pricing,
        rating: mentor.rating,
        reviewCount: mentor.reviewCount,
      };
    });

    return mentors;
  } catch (error) {
    console.error("Error searching mentors:", error);
    return [];
  }
}
