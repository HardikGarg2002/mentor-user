import connectDB from "@/lib/db";
import { Meeting } from "@/models/meeting";
import { IVideoMeet, IVideoMeetStatus } from "@/types/videomeet";

export async function createMeeting({
  meetingId,
  bookedBy,
  mentorId,
  scheduledAt,
  duration,
}: {
  meetingId: string;
  bookedBy: string;
  mentorId: string;
  scheduledAt: Date;
  duration: number;
}): Promise<IVideoMeet> {
  await connectDB();

  try {
    const meeting = new Meeting({
      meetingId,
      bookedBy,
      mentorId,
      scheduledAt,
      duration,
      status: IVideoMeetStatus.SCHEDULED,
    });

    const savedMeeting = await meeting.save();
    return savedMeeting;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
}

export async function getMeetingById(id: string): Promise<IVideoMeet | null> {
  await connectDB();

  try {
    const meeting = await Meeting.findById(id);
    return meeting;
  } catch (error) {
    console.error("Error fetching meeting:", error);
    throw error;
  }
}

export async function getMeetingsByTrainer(
  trainerId: string,
  status?: IVideoMeetStatus
): Promise<IVideoMeet[]> {
  await connectDB();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { trainerId };
    if (status) {
      query.status = status;
    }

    const meetings = await Meeting.find(query).sort({ scheduledAt: 1 });

    return meetings;
  } catch (error) {
    console.error("Error fetching trainer meetings:", error);
    throw error;
  }
}

export async function getMeetingsByUser(
  userId: string,
  status?: IVideoMeetStatus
): Promise<IVideoMeet[]> {
  await connectDB();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { bookedBy: userId };
    if (status) {
      query.status = status;
    }

    const meetings = await Meeting.find(query).sort({ scheduledAt: 1 });

    return meetings;
  } catch (error) {
    console.error("Error fetching user meetings:", error);
    throw error;
  }
}

export async function updateMeetingStatus(
  meetingId: string,
  status: IVideoMeetStatus
): Promise<IVideoMeet | null> {
  await connectDB();

  try {
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { status },
      { new: true }
    );
    return meeting;
  } catch (error) {
    console.error("Error updating meeting status:", error);
    throw error;
  }
}
