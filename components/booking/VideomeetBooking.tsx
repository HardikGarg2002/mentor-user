"use client";
import { createVideoLink } from "@/actions/meeting-actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BookVideoCallDialog = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [meetingLink, setMeetingLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Demo mentor data
  const demoMentor = {
    id: "67d4709d9d1e7c742b328ade",
    name: "John Doe",
    pricing: {
      video: 50,
    },
    availability: {
      Monday: [
        { start: "09:00", end: "10:00" },
        { start: "14:00", end: "15:00" },
      ],
      Wednesday: [
        { start: "11:00", end: "12:00" },
        { start: "16:00", end: "17:00" },
      ],
      Friday: [
        { start: "10:00", end: "11:00" },
        { start: "15:00", end: "16:00" },
      ],
    },
  };

  const handleBookSession = async () => {
    if (!selectedDay || !selectedSlot) return;

    try {
      setIsBooking(true);

      // Extract start and end times
      const [startTime, endTime] = selectedSlot.split(" - ");

      // Convert selected day to a real date (assume next occurrence)
      const today = new Date();
      const dayOfWeekIndex = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(selectedDay);

      const scheduledDate = new Date(today);
      scheduledDate.setDate(
        today.getDate() + ((dayOfWeekIndex - today.getDay() + 7) % 7)
      ); // Next selected day
      scheduledDate.setHours(parseInt(startTime.split(":")[0]), 0, 0, 0); // Set start time
      const scheduledAt = scheduledDate; // Convert to ISO format

      // Calculate duration in minutes
      const duration =
        (parseInt(endTime.split(":")[0]) - parseInt(startTime.split(":")[0])) *
        60;

      const response = await createVideoLink({
        mentorId: demoMentor.id,
        scheduledAt: scheduledAt,
        bookedBy: session?.user?.id || "guest",
        duration: duration,
      });

      console.log("response: ", response);
      router.push(`/meeting?meetingId=${response}`);
    } catch (error) {
      console.error("Error booking session:", error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      {/* Open Dialog Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Book a Call
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>

            {/* Dialog Header */}
            <h2 className="text-2xl font-bold mb-4">Book a Video Call</h2>

            {/* Mentor Info */}
            <p className="text-gray-500">Mentor: {demoMentor.name}</p>
            <p className="text-gray-500">
              Price per session: ${demoMentor.pricing.video}
            </p>

            {/* Day Selection */}
            <select
              className="w-full mt-3 p-2 border rounded-md"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Select a Day</option>
              {Object.keys(demoMentor.availability).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            {/* Time Slot Selection */}
            {selectedDay && demoMentor.availability[selectedDay] && (
              <select
                className="w-full mt-3 p-2 border rounded-md"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select a Time Slot</option>
                {demoMentor.availability[selectedDay].map((slot, index) => (
                  <option key={index} value={`${slot.start} - ${slot.end}`}>
                    {slot.start} - {slot.end}
                  </option>
                ))}
              </select>
            )}

            {/* Booking Button / Meeting Link */}
            {meetingLink ? (
              <p className="text-green-600 mt-4">
                Meeting booked!{" "}
                <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                  Join here
                </a>
              </p>
            ) : (
              <button
                onClick={handleBookSession}
                disabled={isBooking || !selectedSlot}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {isBooking ? "Booking..." : "Book Now"}
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookVideoCallDialog;
