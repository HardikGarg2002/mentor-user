/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/calendar/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  addAvailabilitySlot,
  deleteAvailabilitySlot,
  getMentorAvailability,
} from "@/actions/availability-actions";

// Days of the week for recurring options
const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// Time slots options (30 min increments)
const TIME_SLOTS = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
];

export default function MentorAvailability() {
  // const router = useRouter()
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch availability data
  async function fetchAvailability() {
    const data = await getMentorAvailability(activeTab === "all");
    setAvailabilitySlots(data);
  }

  useEffect(() => {
    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Handle recurring day toggle
  const toggleRecurringDay = (day: number) => {
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
      });
      return;
    }

    if (!startTime || !endTime) {
      toast({
        title: "Error",
        description: "Please select start and end times",
      });
      return;
    }

    // Check if start time is before end time
    const startIndex = TIME_SLOTS.indexOf(startTime);
    const endIndex = TIME_SLOTS.indexOf(endTime);

    if (startIndex >= endIndex) {
      toast({
        title: "Error",
        description: "End time must be after start time",
      });
      return;
    }

    // Check if recurring has days selected
    if (isRecurring && recurringDays.length === 0) {
      toast({
        title: "Error",
        description:
          "Please select at least one day for recurring availability",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await addAvailabilitySlot({
        date: selectedDate.toISOString(),
        startTime,
        endTime,
        isRecurring,
        recurringDays: isRecurring ? recurringDays : undefined,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Success",
          description: "Availability added successfully",
        });

        // Reset form and close dialog
        setStartTime("");
        setEndTime("");
        setIsRecurring(false);
        setRecurringDays([]);
        setIsDialogOpen(false);

        // Refresh data
        fetchAvailability();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add availability",
      });
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slot deletion
  const handleDeleteSlot = async (slotId: string, isRecurring: boolean) => {
    if (confirm("Are you sure you want to delete this availability slot?")) {
      try {
        const deleteAll =
          isRecurring &&
          confirm("Do you want to delete all future recurring instances?");

        const result = await deleteAvailabilitySlot(slotId, deleteAll);

        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
          });
        } else {
          toast({
            title: "Success",
            description: "Availability slot deleted",
          });

          // Refresh data
          fetchAvailability();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete availability slot",
        });
        console.log("error", error);
      }
    }
  };

  // Group slots by date for display
  const groupedSlots: any = availabilitySlots.reduce((acc, slot) => {
    const date = format(parseISO(slot.date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, typeof availabilitySlots>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Availability</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2 sm:mt-0">
              <Calendar className="mr-2 h-4 w-4" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Availability</DialogTitle>
              <DialogDescription>
                Set when youre available for mentoring sessions.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker date={selectedDate} onSelect={setSelectedDate} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger id="endTime">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) =>
                    setIsRecurring(checked === true)
                  }
                />
                <Label htmlFor="isRecurring">Recurring availability</Label>
              </div>

              {isRecurring && (
                <div className="space-y-2">
                  <Label>Repeat on</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={recurringDays.includes(day.value)}
                          onCheckedChange={() => toggleRecurringDay(day.value)}
                        />
                        <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Availability"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="all">All Slots</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {Object.keys(groupedSlots).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No upcoming availability slots. Add some to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedSlots)
              .sort(
                ([dateA], [dateB]) =>
                  new Date(dateA).getTime() - new Date(dateB).getTime()
              )
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map(([date, slots]: any) => (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle>
                      {format(new Date(date), "EEEE, MMMM d, yyyy")}
                    </CardTitle>
                    <CardDescription>
                      {slots.length} time slot(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`flex justify-between items-center p-3 rounded-md ${
                            slot.isBooked
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div>
                            <p className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {slot.isBooked ? "Booked" : "Available"}
                              {slot.isRecurring && " • Recurring"}
                            </p>
                          </div>
                          {!slot.isBooked && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteSlot(slot.id, slot.isRecurring)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {Object.keys(groupedSlots).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No availability slots found.
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedSlots)
              .sort(
                ([dateA], [dateB]) =>
                  new Date(dateA).getTime() - new Date(dateB).getTime()
              )
              .map(([date, slots]: any) => (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle>
                      {format(new Date(date), "EEEE, MMMM d, yyyy")}
                    </CardTitle>
                    <CardDescription>
                      {slots.length} time slot(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`flex justify-between items-center p-3 rounded-md ${
                            slot.isBooked
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div>
                            <p className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {slot.isBooked ? "Booked" : "Available"}
                              {slot.isRecurring && " • Recurring"}
                            </p>
                          </div>
                          {!slot.isBooked && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteSlot(slot.id, slot.isRecurring)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
