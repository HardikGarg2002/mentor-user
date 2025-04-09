"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addTimeSlot, deleteTimeSlot } from "@/actions/availability-actions";
import type { TimeSlotFormData } from "@/actions/availability-actions";
// import { formatTimeForDisplay } from "@/lib/availability";

// Get weekday name
const getWeekdayName = (dayOfWeek: number) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[dayOfWeek];
};

interface DayTimeSlotsProps {
  dayOfWeek: number;
  timeSlots: {
    id: string;
    startTime: string;
    endTime: string;
    timezone: string;
  }[];
  onUpdate: () => void;
}

export function DayTimeSlots({
  dayOfWeek,
  timeSlots,
  onUpdate,
}: DayTimeSlotsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      toast({
        title: "Error",
        description: "Please enter both start and end times",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData: TimeSlotFormData = {
        dayOfWeek,
        startTime,
        endTime,
      };

      const result = await addTimeSlot(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Time slot added successfully",
        });
        setStartTime("");
        setEndTime("");
        setIsAdding(false);
        onUpdate();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add time slot",
        });
      }
    } catch (error) {
      console.error("Error adding time slot:", error);
      toast({
        title: "Error",
        description: "Failed to add time slot",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (confirm("Are you sure you want to delete this time slot?")) {
      setIsLoading(true);

      try {
        const result = await deleteTimeSlot(id);

        if (result.success) {
          toast({
            title: "Success",
            description: "Time slot deleted successfully",
          });
          onUpdate();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete time slot",
          });
        }
      } catch (error) {
        console.error("Error deleting time slot:", error);
        toast({
          title: "Error",
          description: "Failed to delete time slot",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getWeekdayName(dayOfWeek)}</CardTitle>
      </CardHeader>
      <CardContent>
        {timeSlots.length > 0 ? (
          <div className="space-y-2 mb-4">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                {/* <span>
                  {formatTimeForDisplay(slot.startTime)} -{" "}
                  {formatTimeForDisplay(slot.endTime)}
                </span> */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTimeSlot(slot.id)}
                  disabled={isLoading}
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

        {isAdding ? (
          <form onSubmit={handleAddTimeSlot} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor={`start-time-${dayOfWeek}`}>Start Time</Label>
                <Input
                  id={`start-time-${dayOfWeek}`}
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`end-time-${dayOfWeek}`}>End Time</Label>
                <Input
                  id={`end-time-${dayOfWeek}`}
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Time Slot"}
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
