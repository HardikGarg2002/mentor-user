"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  addTimeSlot,
  deleteTimeSlot,
  getMentorWeeklyAvailability,
} from "@/actions/availability-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle } from "lucide-react";

// Helper function to convert time string to minutes for comparison
function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Days of the week
const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// Timezones (sample set - adjust as needed)
const TIMEZONES = [
  { value: "Asia/Calcutta", label: "India (GMT+5:30)" },
  { value: "America/New_York", label: "Eastern Time (GMT-5)" },
  { value: "America/Los_Angeles", label: "Pacific Time (GMT-8)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central European (GMT+1)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+11)" },
];

// Time slots options (30 min increments for dropdown selection)
const TIME_OPTIONS = [
  { value: "08:00", label: "8:00 AM" },
  { value: "08:30", label: "8:30 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "21:30", label: "9:30 PM" },
];

// Time display helper
function formatTimeDisplay(time: string): string {
  const timeOption = TIME_OPTIONS.find((option) => option.value === time);
  return timeOption ? timeOption.label : time;
}

interface TimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export default function MentorAvailability() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("Asia/Calcutta");

  // Filter end time options based on start time
  const endTimeOptions = startTime
    ? TIME_OPTIONS.filter(
        (option) =>
          convertTimeToMinutes(option.value) > convertTimeToMinutes(startTime)
      )
    : [];

  // Fetch time slots
  const fetchTimeSlots = async () => {
    try {
      const slots = await getMentorWeeklyAvailability();
      console.log("Slots:", slots);
      setTimeSlots(slots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast.error("Error fetching time slots");
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  // Reset end time if it's before start time
  useEffect(() => {
    if (
      startTime &&
      endTime &&
      convertTimeToMinutes(startTime) >= convertTimeToMinutes(endTime)
    ) {
      setEndTime("");
    }
  }, [startTime, endTime]);

  // Group time slots by day
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeSlotsByDay: any = DAYS_OF_WEEK.map((day) => {
    const daySlots = timeSlots.filter((slot) => slot.dayOfWeek === day.value);
    return {
      ...day,
      slots: daySlots.sort(
        (a, b) =>
          convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
      ),
    };
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDay || !startTime || !endTime) {
      toast.error("Please select day, start time and end time");
      return;
    }

    setIsLoading(true);

    try {
      const result = await addTimeSlot({
        dayOfWeek: parseInt(selectedDay, 10),
        startTime,
        endTime,
        timezone,
      });

      if (result.success) {
        toast.success("Time slot added successfully");

        setIsDialogOpen(false);
        setSelectedDay("");
        setStartTime("");
        setEndTime("");
        fetchTimeSlots();
      } else {
        toast.error("Failed to add time slot");
        console.log("error occured", result.error);
      }
    } catch (error) {
      console.error("Error adding time slot:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle time slot deletion
  const handleDeleteTimeSlot = async (id: string) => {
    if (confirm("Are you sure you want to delete this time slot?")) {
      try {
        const result = await deleteTimeSlot(id);

        if (result.success) {
          toast.error("Time slot deleted successfully");

          fetchTimeSlots();
        } else {
          toast.error("Failed to delete time slot");
          console.log("failed to delete slot, Error: ", result.error);
        }
      } catch (error) {
        console.error("Error deleting time slot:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Weekly Availability</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2 sm:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Weekly Time Slot</DialogTitle>
              <DialogDescription>
                Set when you&apos;re available for mentoring sessions each week.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Select
                    value={endTime}
                    onValueChange={setEndTime}
                    disabled={!startTime}
                  >
                    <SelectTrigger id="endTime">
                      <SelectValue
                        placeholder={
                          !startTime
                            ? "Select start time first"
                            : "Select end time"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {endTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Time Slot"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {timeSlotsByDay.map((day) => (
          <Card
            key={day.value}
            className={day.slots.length === 0 ? "opacity-70" : ""}
          >
            <CardHeader>
              <CardTitle>{day.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {day.slots.length === 0 ? (
                <p className="text-muted-foreground">
                  No time slots set for this day
                </p>
              ) : (
                <div className="space-y-2">
                  {day.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center p-3 rounded-md bg-gray-50 border border-gray-200"
                    >
                      <div>
                        <p className="font-medium">
                          {formatTimeDisplay(slot.startTime)} -{" "}
                          {formatTimeDisplay(slot.endTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Timezone: {slot.timezone || "Asia/Calcutta"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTimeSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
