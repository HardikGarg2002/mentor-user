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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { bookSession, getMentorBookedSlots } from "@/actions/booking-actions";
import { getMentorWeeklyAvailabilityById } from "@/actions/availability-actions";
import SessionTypeSelector from "./SessionTypeSelector";
import { format, getDay, parseISO } from "date-fns";
import { CalendarIcon, Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Import types from the central types system
import {
  WeeklyAvailabilitySlot,
  BookedSlot,
  TimeSlot,
  timeToMinutes,
  SessionType,
  MentorPricing,
} from "@/types";
import { isSessionAvailable } from "@/lib/utils/session-utils";

// Custom CSS for scrollbars
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(var(--primary), 0.2);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--primary), 0.3);
  }
`;

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
  const now = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

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

      // Skip slots that have already passed for today
      if (isToday && slotEnd <= currentMinutes) continue;

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

// Group time slots by time period
const groupSlotsByTimePeriod = (slots: TimeSlot[]) => {
  // Sort by start time
  const sortedSlots = [...slots].sort(
    (a, b) => timeToMinutes(a.rawStartTime) - timeToMinutes(b.rawStartTime)
  );

  const groups: { [key: string]: TimeSlot[] } = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };

  sortedSlots.forEach((slot) => {
    const minutes = timeToMinutes(slot.rawStartTime);

    if (minutes >= 6 * 60 && minutes < 12 * 60) {
      groups["morning"].push(slot);
    } else if (minutes >= 12 * 60 && minutes < 17 * 60) {
      groups["afternoon"].push(slot);
    } else if (minutes >= 17 * 60 && minutes < 22 * 60) {
      groups["evening"].push(slot);
    } else {
      groups["night"].push(slot);
    }
  });

  // Filter out empty groups
  return Object.entries(groups).filter(([_, slots]) => slots.length > 0);
};

export default function SessionBooking({ mentor }: SessionBookingProps) {
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
  const [activeTimeTab, setActiveTimeTab] = useState<string>("morning");

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

        // bookedSlotsData is now directly usable without mapping
        setBookedSlots(bookedSlotsData);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        toast.error("Error", {
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

      // Set initial active tab based on available slots
      const groups = groupSlotsByTimePeriod(slots);
      if (groups.length > 0) {
        setActiveTimeTab(groups[0][0]);
      } else {
        setActiveTimeTab("morning");
      }
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
          toast.warning("Invalid Selection", {
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
      toast.error("Error", {
        description: "Please select at least one time slot",
      });
      return;
    }

    // Get the selected slots
    const selectedSlots = getSelectedSlots();

    // Make sure they are consecutive
    if (!areConsecutiveSlots(selectedSlots)) {
      toast.warning("Invalid Selection", {
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

    // Check if the slot is still available
    const slotInfo = `${mentor.userId}_${dateStr}_${startTime}_${endTime}`;
    const checkSession = await isSessionAvailable(slotInfo);

    if (!checkSession.available) {
      // Show an error message
      toast.error("Session Unavailable", {
        description:
          checkSession.reason === "Session reserved"
            ? "This slot is currently reserved by another user. Please try again later or select a different time."
            : "This slot is no longer available. It may have been booked by another user.",
      });

      // Refresh the available slots
      const bookedSlotsData = await getMentorBookedSlots(mentor.userId);
      setBookedSlots(bookedSlotsData);

      return;
    }

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
          toast.error("Booking Failed", {
            description: result.error,
          });
          console.log("Booking failed", result.error);
        } else {
          toast.success("Booking Reserved", {
            description:
              "Your session has been reserved, Please complete your payment to Book the session",
          });
          router.push(`/sessions/${result.sessionId}`);
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Booking error:", error);
        toast.error("Booking Failed", {
          description: "There was an error booking your session",
        });
      }
    });
  };

  // Create time period display names
  const timePeriodNames = {
    morning: "Morning (6AM-12PM)",
    afternoon: "Afternoon (12PM-5PM)",
    evening: "Evening (5PM-10PM)",
    night: "Night (10PM-6AM)",
  };

  return (
    <div className="space-y-4">
      {/* Custom scrollbar styles */}
      <style jsx global>
        {scrollbarStyles}
      </style>

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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Book a Session with {mentor.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Selected Type */}
            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}{" "}
                  Session
                </span>
                <Badge className="px-2 py-1">
                  ₹{mentor.pricing[selectedType]}/hr
                </Badge>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <div className="space-y-3 flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-base font-medium">Select Date</h3>
              </div>
              <DatePicker
                date={selectedDate}
                setDate={setDate}
                className="w-full"
              />
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-base font-medium">
                    Select Time Slots
                    {selectedSlotIds.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({selectedSlotIds.length} selected)
                      </span>
                    )}
                  </h3>
                </div>

                <Card className="border border-amber-200 bg-amber-50">
                  <CardContent className="p-3 flex gap-2">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium">
                        Selection Guide:
                      </p>
                      <ul className="text-xs text-amber-700 mt-1 list-disc pl-4 space-y-1">
                        <li>Select consecutive 30-minute slots</li>
                        <li>Slots must be in sequence</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {availableSlots.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div>
                      <Tabs
                        value={activeTimeTab}
                        onValueChange={setActiveTimeTab}
                        className="w-full"
                      >
                        <TabsList className="w-full grid-cols-4 grid border-b rounded-none bg-muted/30">
                          {groupSlotsByTimePeriod(availableSlots).map(
                            ([period]) => (
                              <TabsTrigger
                                key={period}
                                value={period}
                                className="text-xs font-medium"
                              >
                                {period.charAt(0).toUpperCase() +
                                  period.slice(1)}
                              </TabsTrigger>
                            )
                          )}
                        </TabsList>

                        {groupSlotsByTimePeriod(availableSlots).map(
                          ([period, slots]) => (
                            <TabsContent
                              key={period}
                              value={period}
                              className="pt-2 px-0 mt-0"
                            >
                              <div className="px-3 py-1 text-xs font-medium text-muted-foreground sticky top-0 bg-background z-10 border-b">
                                {
                                  timePeriodNames[
                                    period as keyof typeof timePeriodNames
                                  ]
                                }
                              </div>
                              <div
                                className="grid grid-cols-2 gap-2 p-3 max-h-[225px] overflow-y-auto custom-scrollbar"
                                style={{ scrollbarWidth: "thin" }}
                              >
                                {slots.map((slot) => {
                                  const isSelected = selectedSlotIds.includes(
                                    slot.id
                                  );
                                  const isAdjacent = getSelectedSlots().some(
                                    (selectedSlot) =>
                                      areSlotsAdjacent(selectedSlot, slot) ||
                                      areSlotsAdjacent(slot, selectedSlot)
                                  );

                                  return (
                                    <div
                                      key={slot.id}
                                      onClick={() =>
                                        !slot.isBooked &&
                                        handleSlotSelection(slot)
                                      }
                                      className={`
                                        p-3 border rounded-md text-center cursor-pointer text-sm relative
                                        transition-all duration-150 ease-in-out
                                        ${
                                          slot.isBooked
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : isSelected
                                            ? "ring-2 ring-primary bg-primary/10 font-medium"
                                            : selectedSlotIds.length > 0 &&
                                              isAdjacent &&
                                              !isSelected
                                            ? "border-primary/50 border-dashed border-2"
                                            : "hover:bg-muted/50 hover:border-primary/30"
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
                            </TabsContent>
                          )
                        )}
                      </Tabs>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        No time slots available for this date
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Price Display */}
            {selectedType && selectedSlotIds.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{calculatePrice().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getTotalDuration()} minutes at ₹
                    {mentor.pricing[selectedType]}
                    /hour
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Timezone Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Select value={timezone} onValueChange={(tz) => setTimezone(tz)}>
                <SelectTrigger className="w-full">
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
              className={selectedSlotIds.length > 0 ? "w-full" : ""}
            >
              {isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
