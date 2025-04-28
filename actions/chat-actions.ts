"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import Chat from "@/models/chat";

// Define validation schema for sending messages
const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  recipientId: z.string().min(1, "Recipient ID is required"),
});

export type MessageFormData = z.infer<typeof messageSchema>;

/**
 * Send a message to another user
 */
export async function sendMessage(formData: MessageFormData) {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      error: "You must be logged in to send messages",
    };
  }

  try {
    // Validate form data
    const validatedData = messageSchema.parse(formData);

    await connectDB();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get the recipient user
    const recipientUser = await User.findById(validatedData.recipientId);
    if (!recipientUser) {
      return {
        success: false,
        error: "Recipient not found",
      };
    }

    // Determine mentor and mentee IDs
    let mentorId, menteeId;
    if (currentUser.role === "mentor" && recipientUser.role === "user") {
      mentorId = currentUser._id;
      menteeId = recipientUser._id;
    } else if (currentUser.role === "user" && recipientUser.role === "mentor") {
      mentorId = recipientUser._id;
      menteeId = currentUser._id;
    } else {
      return {
        success: false,
        error: "Chat is only available between mentors and mentees",
      };
    }

    // Find existing chat or create a new one
    let chat = await Chat.findOne({
      mentorId,
      menteeId,
    });

    if (!chat) {
      chat = new Chat({
        mentorId,
        menteeId,
        messages: [],
      });
    }

    // Add the new message
    chat.messages.push({
      sender: currentUser._id.toString(),
      content: validatedData.content,
      timestamp: new Date(),
      read: false,
    });

    // Update lastUpdated timestamp
    chat.lastUpdated = new Date();

    await chat.save();

    // Revalidate paths for both users
    revalidatePath(`/dashboard/chats/${chat._id.toString()}`);
    revalidatePath(`/dashboard/chats`);
    // For backward compatibility
    revalidatePath(`/dashboard/mentor/chats/${menteeId}`);
    revalidatePath(`/dashboard/mentee/chats/${mentorId}`);
    revalidatePath(`/dashboard/mentor/chats`);
    revalidatePath(`/dashboard/mentee/chats`);

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Error sending message:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(chatId: string) {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return {
        success: false,
        error: "Chat not found",
      };
    }

    // Check if user is part of this chat
    if (
      chat.mentorId.toString() !== currentUser._id.toString() &&
      chat.menteeId.toString() !== currentUser._id.toString()
    ) {
      return {
        success: false,
        error: "You don't have access to this chat",
      };
    }

    // Mark messages from the other user as read
    let updated = false;
    chat.messages.forEach((message) => {
      if (
        message.sender.toString() !== currentUser._id.toString() &&
        !message.read
      ) {
        message.read = true;
        updated = true;
      }
    });

    if (updated) {
      await chat.save();

      // Revalidate paths
      revalidatePath(`/dashboard/chats/${chat._id.toString()}`);
      revalidatePath(`/dashboard/chats`);
      // For backward compatibility
      revalidatePath(`/dashboard/mentor/chats/${chat.menteeId}`);
      revalidatePath(`/dashboard/mentee/chats/${chat.mentorId}`);
      revalidatePath(`/dashboard/mentor/chats`);
      revalidatePath(`/dashboard/mentee/chats`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return {
      success: false,
      error: "Failed to mark messages as read",
    };
  }
}

export async function testfunction() {
  console.log("successfullt server exectude");
}

/**
 * Get all chats for the current user
 */
export async function getUserChats() {
  const session = await auth();
  if (!session || !session.user) {
    return [];
  }

  try {
    await connectDB();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return [];
    }

    // Find all chats where the user is either mentor or mentee
    const query =
      currentUser.role === "mentor"
        ? { mentorId: currentUser._id }
        : { menteeId: currentUser._id };

    const chats = (await Chat.find(query)
      .sort({ lastUpdated: -1 })
      .populate("mentorId", "name image")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .populate("menteeId", "name image")) as any;

    // Transform the data for the frontend
    return chats.map((chat) => {
      // Determine the other user in the chat
      const otherUser =
        currentUser.role === "mentor"
          ? {
              id: chat.menteeId._id.toString(),
              name: chat.menteeId.name,
              image: chat.menteeId.image,
            }
          : {
              id: chat.mentorId._id.toString(),
              name: chat.mentorId.name,
              image: chat.mentorId.image,
            };

      // Count unread messages
      const unreadCount = chat.messages.filter(
        (msg) => !msg.read && !msg.sender.equals(currentUser._id)
      ).length;

      // Get the last message
      const lastMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;

      return {
        id: chat._id.toString(),
        otherUser,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              timestamp: lastMessage.timestamp.toISOString(),
              isFromUser: lastMessage.sender.equals(currentUser._id),
            }
          : null,
        unreadCount,
        lastUpdated: chat.lastUpdated.toISOString(),
      };
    });
  } catch (error) {
    console.error("Error getting user chats:", error);
    return [];
  }
}

/**
 * Get a specific chat by ID
 */
export async function getChatById(chatId: string) {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }

  try {
    await connectDB();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return null;
    }

    // Find the chat
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chat = (await Chat.findById(chatId)
      .populate("mentorId", "name image")
      .populate("menteeId", "name image")) as any;

    if (!chat) {
      return null;
    }

    // Check if user is part of this chat
    if (
      !chat.mentorId._id.equals(currentUser._id) &&
      !chat.menteeId._id.equals(currentUser._id)
    ) {
      return null;
    }

    // Determine the other user in the chat
    const otherUser =
      currentUser.role === "mentor"
        ? {
            id: chat.menteeId._id.toString(),
            name: chat.menteeId.name,
            image: chat.menteeId.image,
          }
        : {
            id: chat.mentorId._id.toString(),
            name: chat.mentorId.name,
            image: chat.mentorId.image,
          };

    // Transform messages for the frontend
    const messages = chat.messages.map((msg) => ({
      id: msg._id.toString(),
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
      isFromUser: msg.sender.equals(currentUser._id),
      read: msg.read,
    }));

    return {
      id: chat._id.toString(),
      otherUser,
      messages,
      lastUpdated: chat.lastUpdated.toISOString(),
    };
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    return null;
  }
}

/**
 * Get or create a chat with another user
 */
export async function getOrCreateChat(otherUserId: string) {
  try {
    const session = await auth();
    console.log("Session data:", {
      exists: !!session,
      user: session?.user,
      email: session?.user?.email,
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "You must be logged in to chat",
      };
    }

    await connectDB();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get the other user
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Determine mentor and mentee IDs
    let mentorId, menteeId;
    if (currentUser.role === "mentor" && otherUser.role === "user") {
      mentorId = currentUser._id;
      menteeId = otherUser._id;
    } else if (currentUser.role === "user" && otherUser.role === "mentor") {
      mentorId = otherUser._id;
      menteeId = currentUser._id;
    } else {
      return {
        success: false,
        error: "Chat is only available between mentors and mentees",
      };
    }

    // Find existing chat or create a new one
    let chat = await Chat.findOne({
      mentorId,
      menteeId,
    });

    if (!chat) {
      chat = new Chat({
        mentorId,
        menteeId,
        messages: [],
      });
      await chat.save();
    }

    return {
      success: true,
      chatId: chat._id.toString(),
    };
  } catch (error) {
    console.error("Error getting or creating chat:", error);
    return {
      success: false,
      error: "Failed to create chat. Please try again.",
    };
  }
}
