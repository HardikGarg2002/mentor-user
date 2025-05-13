import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMessage {
  sender: mongoose.Types.ObjectId | string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface IChat extends Document {
  mentorId: mongoose.Types.ObjectId | string;
  menteeId: mongoose.Types.ObjectId | string;
  messages: IMessage[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const ChatSchema = new Schema<IChat>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [MessageSchema],
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure unique chat between mentor and mentee
ChatSchema.index({ mentorId: 1, menteeId: 1 }, { unique: true });

// Prevent model overwrite error in development due to hot reloading
const Chat =
  (mongoose.models.Chat as Model<IChat>) ||
  mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
