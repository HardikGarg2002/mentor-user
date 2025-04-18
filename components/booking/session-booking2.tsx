"use client";

import { useRouter } from "next/navigation";
import React, { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/calendar/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { bookSession, getMentorBookedSlots } from "@/actions/booking-actions";
import { getMentorWeeklyAvailabilityById } from "@/actions/availability-actions";
import SessionTypeSelector from "./SessionTypeSelector";
import { format, getDay, parseISO } from "date-fns";

// Import types from the central types system
import {
  WeeklyAvailabilitySlot,
  BookedSlot,
  TimeSlot,
  timeToMinutes,
  SessionType,
  MentorPricing,
} from "@/types";

// Use a more specific type with only the required properties
type BookingMentorData = {
  userId: string;
  name: string;
  pricing: MentorPricing;
};

type SessionBookingProps = {
  mentor: BookingMentorData;
};

// Generate time slots from weekly availability for a specific date
function generateTimeSlotsForDate(
  weeklyAvailability: WeeklyAvailabilitySlot[],
  date: Date,
  bookedSlots: BookedSlot[] = []
): TimeSlot[] {
  const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
  const dateStr = format(date, "yyyy-MM-dd");

  // Filter availability for the day of week
  const dayAvailability = weeklyAvailability.filter(
    (slot) => slot.dayOfWeek === dayOfWeek
  );

  if (dayAvailability.length === 0) return [];

  // Generate 30-minute slots for each availability block
  const slots = [];

  for (const availability of dayAvailability) {
    const startMinutes = timeToMinutes(availability.startTime);
    const endMinutes = timeToMinutes(availability.endTime);

    // Generate slots at 30-minute intervals
    for (
      let slotStart = startMinutes;
      slotStart < endMinutes;
      slotStart += 30
    ) {
      // If less than 30 minutes remain, don't create a partial slot
      if (slotStart + 30 > endMinutes) break;

      const slotEnd = slotStart + 30;

      const startTimeStr = `${Math.floor(slotStart / 60)
        .toString()
        .padStart(2, "0")}:${(slotStart % 60).toString().padStart(2, "0")}`;
      const endTimeStr = `${Math.floor(slotEnd / 60)
        .toString()
        .padStart(2, "0")}:${(slotEnd % 60).toString().padStart(2, "0")}`;

      // Format for display
      const startTimeDisplay = format(
        parseISO(`${dateStr}T${startTimeStr}:00`),
        "h:mm a"
      );
      const endTimeDisplay = format(
        parseISO(`${dateStr}T${endTimeStr}:00`),
        "h:mm a"
      );

      // Check if slot is booked
      const isBooked = bookedSlots.some(
        (bookedSlot) =>
          bookedSlot.date === dateStr &&
          timeToMinutes(bookedSlot.startTime) <= slotStart &&
          timeToMinutes(bookedSlot.endTime) > slotStart
      );

      slots.push({
        id: `${dateStr}_${startTimeStr}_${endTimeStr}_${availability.id}`,
        startTime: startTimeDisplay,
        endTime: endTimeDisplay,
        rawStartTime: startTimeStr,
        rawEndTime: endTimeStr,
        isBooked,
        duration: 30, // 30-minute intervals
        availabilityId: availability.id,
      });
    }
  }

  return slots.sort(
    (a, b) => timeToMinutes(a.rawStartTime) - timeToMinutes(b.rawStartTime)
  );
}

// Helper function to check if two slots are adjacent
function areSlotsAdjacent(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return (
    slot1.rawEndTime === slot2.rawStartTime &&
    slot1.availabilityId === slot2.availabilityId
  );
}

// Helper function to check if slots are consecutive
function areConsecutiveSlots(slots: TimeSlot[]): boolean {
  if (slots.length <= 1) return true;

  // Sort slots by start time
  const sortedSlots = [...slots].sort(
    (a, b) => timeToMinutes(a.rawStartTime) - timeToMinutes(b.rawStartTime)
  );

  // Check if each pair of slots is adjacent
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    if (!areSlotsAdjacent(sortedSlots[i], sortedSlots[i + 1])) {
      return false;
    }
  }

  return true;
}

export default function SessionBooking2({ mentor }: SessionBookingProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SessionType>("chat");
  const [selectedDate, setDate] = useState<Date | undefined>(new Date());
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Session info
  const [weeklyAvailability, setWeeklyAvailability] = useState<
    WeeklyAvailabilitySlot[]
  >([]);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Allow multiple slot selection
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  // Calculate session price based on number of selected slots
  const calculatePrice = () => {
    if (!selectedType || selectedSlotIds.length === 0) return 0;
    const hourlyRate = mentor.pricing[selectedType] || 0;
    // Each slot is 30 minutes, so multiply the number of slots by 30 to get total minutes
    const totalMinutes = selectedSlotIds.length * 30;
    return (totalMinutes / 60) * hourlyRate;
  };

  // Get the total duration of selected slots
  const getTotalDuration = () => {
    return selectedSlotIds.length * 30;
  };

  // Find selected slots from their IDs
  const getSelectedSlots = (): TimeSlot[] => {
    return selectedSlotIds
      .map((id) => availableSlots.find((slot) => slot.id === id))
      .filter((slot) => slot !== undefined) as TimeSlot[];
  };

  // Fetch mentor's weekly availability and booked slots
  useEffect(() => {
    const fetchMentorData = async () => {
      setIsLoading(true);
      try {
        // Fetch both availability and booked slots in parallel
        const [availabilityData, bookedSlotsData] = await Promise.all([
          getMentorWeeklyAvailabilityById({ mentorId: mentor.userId }),
          getMentorBookedSlots(mentor.userId),
        ]);

        setWeeklyAvailability(availabilityData);
        // Convert Date objects to strings in bookedSlotsData if needed
        const formattedBookedSlots = bookedSlotsData.map((slot) => ({
          date:
            typeof slot.date === "string"
              ? slot.date
              : format(new Date(slot.date), "yyyy-MM-dd"),
          startTime: slot.startTime,
          endTime: slot.endTime,
        }));
        setBookedSlots(formattedBookedSlots);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        toast({
          title: "Error",
          description: "Failed to load mentor's availability",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorData();
  }, [mentor.userId]);

  // Generate time slots when date or availability changes
  useEffect(() => {
    if (selectedDate && weeklyAvailability.length > 0) {
      const slots = generateTimeSlotsForDate(
        weeklyAvailability,
        selectedDate,
        bookedSlots
      );
      setAvailableSlots(slots);
      // Clear selected slots when date changes
      setSelectedSlotIds([]);
    } else {
      setAvailableSlots([]);
      setSelectedSlotIds([]);
    }
  }, [selectedDate, weeklyAvailability, bookedSlots]);

  // Handle slot selection
  const handleSlotSelection = (slot: TimeSlot) => {
    // Skip if slot is already booked
    if (slot.isBooked) return;

    // Toggle selection
    setSelectedSlotIds((prev) => {
      const isSelected = prev.includes(slot.id);

      if (isSelected) {
        // If already selected, remove it
        return prev.filter((id) => id !== slot.id);
      } else {
        // If not selected, add it
        const newSelection = [...prev, slot.id];

        // Get the slots objects from their IDs
        const selectedSlots = newSelection
          .map((id) => availableSlots.find((s) => s.id === id))
          .filter((s) => s !== undefined) as TimeSlot[];

        // Check if the new selection forms consecutive slots
        if (!areConsecutiveSlots(selectedSlots)) {
          toast({
            title: "Invalid Selection",
            description: "Please select consecutive time slots",
          });
          return prev;
        }

        return newSelection;
      }
    });
  };

  // Handle booking session
  const handleBookSession = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!selectedDate || selectedSlotIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one time slot",
      });
      return;
    }

    // Get the selected slots
    const selectedSlots = getSelectedSlots();

    // Make sure they are consecutive
    if (!areConsecutiveSlots(selectedSlots)) {
      toast({
        title: "Invalid Selection",
        description: "Please select consecutive time slots",
      });
      return;
    }

    // Sort slots by start time
    const sortedSlots = [...selectedSlots].sort(
      (a, b) => timeToMinutes(a.rawStartTime) - timeToMinutes(b.rawStartTime)
    );

    // Get the first and last slot to determine start and end times
    const firstSlot = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];

    if (!firstSlot || !lastSlot) return;

    // Extract date and times from slots
    const [dateStr] = firstSlot.id.split("_");
    const startTime = firstSlot.rawStartTime;
    const endTime = lastSlot.rawEndTime;
    const availabilityId = firstSlot.availabilityId;
    const duration = getTotalDuration();

    startTransition(async () => {
      try {
        const result = await bookSession({
          mentorId: mentor.userId,
          date: dateStr,
          startTime,
          endTime,
          availabilityId,
          meeting_type: selectedType,
          duration,
          timezone,
        });

        if (result.error) {
          toast({ title: "Booking Failed", description: result.error });
        } else {
          toast({
            title: "Booking Successful",
            description: "Your session has been booked",
          });
          router.push("/dashboard/mentee");
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Booking error:", error);
        toast({
          title: "Booking Failed",
          description: "There was an error booking your session",
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Session Type Selection */}
      <SessionTypeSelector
        selectedType={selectedType}
        pricing={mentor.pricing}
        setSelectedType={setSelectedType}
      />

      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">Schedule Session</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book a Session with {mentor.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Selected Type */}
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}{" "}
                Session
              </span>
              <span className="font-semibold ml-auto">
                ${mentor.pricing[selectedType]}/hr
              </span>
            </div>

            {/* Date Selection */}
            <div className="space-y-2 flex items-center justify-between px-1">
              <label className="text-sm font-medium">Select Date</label>
              <DatePicker date={selectedDate} setDate={setDate} />
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Time Slots ({selectedSlotIds.length} selected)
                </label>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                  <p className="text-sm text-amber-800 font-medium">
                    Selection Guide:
                  </p>
                  <ul className="text-xs text-amber-700 mt-1 list-disc pl-4 space-y-1">
                    <li>
                      Select consecutive 30-minute slots to build your session
                    </li>
                    <li>
                      You can select multiple slots, but they must be in
                      sequence
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => {
                    // Check if this slot is adjacent to any selected slot
                    const isAdjacentToSelected = () => {
                      if (selectedSlotIds.length === 0) return true;

                      const selectedSlots = getSelectedSlots();
                      return selectedSlots.some(
                        (selectedSlot) =>
                          areSlotsAdjacent(selectedSlot, slot) ||
                          areSlotsAdjacent(slot, selectedSlot)
                      );
                    };

                    const isSelected = selectedSlotIds.includes(slot.id);
                    const isAdjacent = isAdjacentToSelected();

                    return (
                      <div
                        key={slot.id}
                        onClick={() =>
                          !slot.isBooked && handleSlotSelection(slot)
                        }
                        className={`
                          p-2 border rounded-md text-center cursor-pointer text-sm relative
                          ${
                            slot.isBooked
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : isSelected
                              ? "ring-2 ring-primary bg-primary/10 font-medium"
                              : isAdjacent && !isSelected
                              ? "border-primary/50 border-dashed"
                              : "hover:bg-gray-50"
                          }
                        `}
                      >
                        {slot.startTime} - {slot.endTime}
                        {isSelected && (
                          <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {selectedSlotIds.indexOf(slot.id) + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Display */}
            {selectedType && selectedSlotIds.length > 0 && (
              <div className="rounded-md bg-muted p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-lg font-bold">
                    ${calculatePrice().toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {getTotalDuration()} minutes at $
                  {mentor.pricing[selectedType]}
                  /hour
                </p>
              </div>
            )}

            {/* Timezone Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Select value={timezone} onValueChange={(tz) => setTimezone(tz)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {Intl.supportedValuesOf("timeZone").map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleBookSession}
              disabled={
                !selectedDate ||
                selectedSlotIds.length === 0 ||
                isPending ||
                isLoading
              }
            >
              {isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
