import connectDB from "@/lib/db";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import type { MentorProfile } from "@/types/mentor";

const MENTORS_PER_PAGE = 10;

export async function getMentors({
  page = 1,
  specialties,
  minPrice,
  maxPrice,
  minRating,
  search,
  limit = MENTORS_PER_PAGE,
}: {
  page?: number;
  specialties?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  limit?: number;
}) {
  await connectDB();

  // Build the filter query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};

  if (specialties && specialties.length > 0) {
    query.specialties = { $in: specialties };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.$or = [
      { "pricing.chat": {} },
      { "pricing.video": {} },
      { "pricing.call": {} },
    ];

    if (minPrice !== undefined) {
      query.$or[0]["pricing.chat"].$gte = minPrice;
      query.$or[1]["pricing.video"].$gte = minPrice;
      query.$or[2]["pricing.call"].$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      query.$or[0]["pricing.chat"].$lte = maxPrice;
      query.$or[1]["pricing.video"].$lte = maxPrice;
      query.$or[2]["pricing.call"].$lte = maxPrice;
    }
  }

  if (minRating !== undefined) {
    query.rating = { $gte: minRating };
  }

  // Get total count for pagination
  const totalMentors = await Mentor.countDocuments(query);
  const totalPages = Math.ceil(totalMentors / MENTORS_PER_PAGE);

  // Get mentors with pagination
  const mentorDocs = await Mentor.find(query)
    .sort({ rating: -1, reviewCount: -1 }) // Sort by rating first, then by number of reviews
    .skip((page - 1) * limit)
    .limit(limit);

  // Get user information for each mentor
  const userIds = mentorDocs.map((mentor) => mentor.userId);
  const users = await User.find({ _id: { $in: userIds } });

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

  // Filter by search term if provided
  let filteredMentors = mentors;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredMentors = mentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.title.toLowerCase().includes(searchLower) ||
        mentor.about.toLowerCase().includes(searchLower) ||
        mentor.specialties.some((s) => s.toLowerCase().includes(searchLower))
    );
  }

  return {
    mentors: filteredMentors,
    totalPages,
    currentPage: page,
  };
}

export async function getMentorByUserId(
  userId: string
): Promise<MentorProfile | null> {
  await connectDB();

  const mentor = await Mentor.findOne({ userId });

  if (!mentor) {
    return null;
  }

  const user = await User.findById(mentor.userId);

  if (!user) {
    return null;
  }

  return {
    id: mentor._id.toString(),
    userId: mentor.userId.toString(),
    name: user.name,
    title: mentor.title,
    image: user.image,
    about: mentor.about,
    specialties: mentor.specialties,
    experience: mentor.experience,
    education: mentor.education,
    pricing: mentor.pricing,
    rating: mentor.rating,
    reviewCount: mentor.reviewCount,
  };
}
