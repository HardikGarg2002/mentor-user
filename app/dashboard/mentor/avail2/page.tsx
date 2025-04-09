"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { DayTimeSlots } from "@/components/availability/day-time-slots";
import { getMentorWeeklyAvailability } from "@/actions/availability-actions";

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

export default function MentorAvailability2() {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load availability data
  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const slots = await getMentorWeeklyAvailability();
      setTimeSlots(slots);

      // Set selected days based on existing time slots
      const days = [...new Set(slots.map((slot) => slot.dayOfWeek))];
      setSelectedDays(days);
    } catch (error) {
      console.error("Error loading availability:", error);
      toast({
        title: "Error",
        description: "Failed to load availability data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  // Toggle day selection
  const toggleDay = (day: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  // Group time slots by day
  const timeSlotsByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day.value] = timeSlots.filter((slot) => slot.dayOfWeek === day.value);
    return acc;
  }, {} as Record<number, typeof timeSlots>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Select Days</h2>
              <div className="space-y-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={() => toggleDay(day.value)}
                    />
                    <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Loading availability...
                  </p>
                </CardContent>
              </Card>
            ) : selectedDays.length > 0 ? (
              selectedDays.map((day) => (
                <DayTimeSlots
                  key={day}
                  dayOfWeek={day}
                  timeSlots={timeSlotsByDay[day] || []}
                  onUpdate={loadAvailability}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Please select at least one day to set your availability.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
