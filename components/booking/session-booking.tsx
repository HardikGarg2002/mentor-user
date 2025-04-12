"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/calendar/date-picker";
import { TimeSlotPicker } from "@/components/calendar/time-slot-picker";
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
import { getMentorAvailabilityById } from "@/actions/availability-actions";
import type { MentorProfile } from "@/types/mentor";
import SessionTypeSelector from "./SessionTypeSelector";
import { format, getDay, parseISO } from "date-fns";
import { SessionType } from "./SessionTypeSelector";

type SessionBookingProps = {
  mentor: MentorProfile;
};

// Duration options (in minutes)
const DURATION_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

// Helper to convert time from "HH:MM" format to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

interface WeeklyAvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

interface BookedSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  rawStartTime: string;
  rawEndTime: string;
  isBooked: boolean;
  duration: number;
}

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
      });
    }
  }

  return slots.sort(
    (a, b) => timeToMinutes(a.rawStartTime) - timeToMinutes(b.rawStartTime)
  );
}

export default function SessionBooking({ mentor }: SessionBookingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SessionType>("chat");
  const [selectedDate, setDate] = useState<Date | undefined>(new Date());
  const [selectedDuration, setSelectedDuration] = useState<string>("60"); // Default 1 hour
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
  const selectedSlotId = searchParams.get("slot");

  // Calculate session price based on duration and type
  const calculatePrice = () => {
    if (!selectedType || !selectedDuration) return 0;
    const hourlyRate = mentor.pricing[selectedType] || 0;
    return (Number(selectedDuration) / 60) * hourlyRate;
  };

  // Fetch mentor's weekly availability and booked slots
  useEffect(() => {
    const fetchMentorData = async () => {
      setIsLoading(true);
      try {
        // Fetch both availability and booked slots in parallel
        const [availabilityData, bookedSlotsData] = await Promise.all([
          getMentorAvailabilityById(mentor.mentorId),
          getMentorBookedSlots(mentor.mentorId),
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
  }, [mentor.mentorId]);

  // Generate time slots when date or availability changes
  useEffect(() => {
    if (selectedDate && weeklyAvailability.length > 0) {
      const slots = generateTimeSlotsForDate(
        weeklyAvailability,
        selectedDate,
        bookedSlots
      );
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, weeklyAvailability, bookedSlots]);

  // Update URL params
  const updateQueryParams = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  };

  // Handle booking session
  const handleBookSession = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!selectedDate || !selectedSlotId) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
      });
      return;
    }

    // Parse slot ID to get information
    const [dateStr, startTime, endTime, availabilityId] =
      selectedSlotId.split("_");

    startTransition(async () => {
      try {
        const result = await bookSession({
          mentorId: mentor.mentorId,
          date: dateStr,
          startTime,
          endTime,
          availabilityId,
          type: selectedType,
          duration: parseInt(selectedDuration),
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
                <label className="text-sm font-medium">Select Time Slot</label>
                <TimeSlotPicker
                  selectedSlotId={selectedSlotId}
                  availableSlots={availableSlots}
                  onSelectSlot={(slot) => updateQueryParams("slot", slot.id)}
                />
              </div>
            )}

            {/* Duration Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Duration</label>
              <Select
                value={selectedDuration}
                onValueChange={setSelectedDuration}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Display */}
            {selectedType && selectedDuration && (
              <div className="rounded-md bg-muted p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-lg font-bold">
                    ${calculatePrice().toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDuration} minutes at ${mentor.pricing[selectedType]}
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
                !selectedDate || !selectedSlotId || isPending || isLoading
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
