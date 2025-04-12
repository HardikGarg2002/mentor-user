"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

// Available timezones
const COMMON_TIMEZONES = [
  "Asia/Calcutta", // IST
  "America/New_York", // EST
  "America/Los_Angeles", // PST
  "Europe/London", // GMT
  "Europe/Paris", // CET
  "Asia/Tokyo", // JST
  "Australia/Sydney", // AEST
];

interface TimeSlot {
  id?: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  dayOfWeek: number;
  timeSlots: TimeSlot[];
}

interface WeeklyScheduleProps {
  initialSchedule?: DaySchedule[];
  onSave: (schedule: DaySchedule[]) => Promise<void>;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export function WeeklySchedule({
  initialSchedule = [],
  onSave,
  timezone,
  onTimezoneChange,
}: WeeklyScheduleProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [isSaving, setIsSaving] = useState(false);

  // Add a new day to the schedule
  const addDay = () => {
    // Find a day that's not already in the schedule
    const availableDays = DAYS_OF_WEEK.filter(
      (day) => !schedule.some((item) => item.dayOfWeek === day.value)
    );

    if (availableDays.length === 0) {
      toast({
        title: "All days added",
        description: "You've already added all days of the week.",
      });
      return;
    }

    const newDay = availableDays[0].value;
    setSchedule([...schedule, { dayOfWeek: newDay, timeSlots: [] }]);
  };

  // Remove a day from the schedule
  const removeDay = (dayOfWeek: number) => {
    setSchedule(schedule.filter((item) => item.dayOfWeek !== dayOfWeek));
  };

  // Add a time slot to a day
  const addTimeSlot = (dayOfWeek: number) => {
    setSchedule(
      schedule.map((item) => {
        if (item.dayOfWeek === dayOfWeek) {
          return {
            ...item,
            timeSlots: [
              ...item.timeSlots,
              { startTime: "09:00", endTime: "10:00" },
            ],
          };
        }
        return item;
      })
    );
  };

  // Remove a time slot from a day
  const removeTimeSlot = (dayOfWeek: number, index: number) => {
    setSchedule(
      schedule.map((item) => {
        if (item.dayOfWeek === dayOfWeek) {
          const updatedSlots = [...item.timeSlots];
          updatedSlots.splice(index, 1);
          return {
            ...item,
            timeSlots: updatedSlots,
          };
        }
        return item;
      })
    );
  };

  // Update a time slot
  const updateTimeSlot = (
    dayOfWeek: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedule(
      schedule.map((item) => {
        if (item.dayOfWeek === dayOfWeek) {
          const updatedSlots = [...item.timeSlots];
          updatedSlots[index] = {
            ...updatedSlots[index],
            [field]: value,
          };
          return {
            ...item,
            timeSlots: updatedSlots,
          };
        }
        return item;
      })
    );
  };

  // Save the schedule
  const handleSave = async () => {
    // Validate the schedule
    for (const day of schedule) {
      if (day.timeSlots.length === 0) {
        toast({
          title: "Validation Error",
          description: `${
            DAYS_OF_WEEK.find((d) => d.value === day.dayOfWeek)?.label
          } has no time slots.`,
        });
        return;
      }

      for (const slot of day.timeSlots) {
        if (!slot.startTime || !slot.endTime) {
          toast({
            title: "Validation Error",
            description: "All time slots must have start and end times.",
          });
          return;
        }

        // Check if start time is before end time
        if (slot.startTime >= slot.endTime) {
          toast({
            title: "Validation Error",
            description: "End time must be after start time.",
          });
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      await onSave(schedule);
      toast({
        title: "Success",
        description: "Your availability schedule has been saved.",
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Error",
        description: "Failed to save your availability schedule.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Label htmlFor="timezone" className="mb-2 block">
            Default Timezone
          </Label>
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Browser Default</SelectItem>
              {COMMON_TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
              {/* Add option to show all timezones */}
              <SelectItem value="more">More timezones...</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={addDay}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Day
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </div>

      {schedule.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No days added yet. Click Add Day to start creating your
              availability schedule.
            </p>
          </CardContent>
        </Card>
      ) : (
        schedule
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
          .map((day) => (
            <Card key={day.dayOfWeek}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>
                  {DAYS_OF_WEEK.find((d) => d.value === day.dayOfWeek)?.label}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDay(day.dayOfWeek)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {day.timeSlots.length > 0 ? (
                  <div className="space-y-4">
                    {day.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <div>
                            <Label htmlFor={`start-${day.dayOfWeek}-${index}`}>
                              Start Time
                            </Label>
                            <Input
                              id={`start-${day.dayOfWeek}-${index}`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  day.dayOfWeek,
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`end-${day.dayOfWeek}-${index}`}>
                              End Time
                            </Label>
                            <Input
                              id={`end-${day.dayOfWeek}-${index}`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  day.dayOfWeek,
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-6"
                          onClick={() => removeTimeSlot(day.dayOfWeek, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    No time slots added yet.
                  </p>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => addTimeSlot(day.dayOfWeek)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </CardContent>
            </Card>
          ))
      )}
    </div>
  );
}
