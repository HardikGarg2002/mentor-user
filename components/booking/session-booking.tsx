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
import { bookSession } from "@/actions/booking-actions";
import type { MentorProfile } from "@/types/mentor";
import { getAvailableSlotsForDate } from "@/actions/availability-actions";
import SessionTypeSelector from "./SessionTypeSelector";

type SessionBookingProps = {
  mentor: MentorProfile;
};

export default function SessionBooking({ mentor }: SessionBookingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setDate] = React.useState<Date>();

  // Extract params from URL

  const selectedSlotId = searchParams.get("slot");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedType = searchParams.get("type") || ("chat" as any);
  const timezone =
    searchParams.get("timezone") ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [availableSlots, setAvailableSlots] = useState<
    { id: string; startTime: string; endTime: string; date: string }[]
  >([]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      const slots = await fetchAvailableSlots();
      setAvailableSlots(slots);
    };

    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Fetch available slots via Server Actions
  const fetchAvailableSlots = async (): Promise<
    {
      id: string;
      startTime: string;
      endTime: string;
      date: string;
    }[]
  > => {
    if (!selectedDate) return [];
    return await getAvailableSlotsForDate(
      mentor.userId,
      selectedDate.toISOString()
    );
  };

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

    startTransition(async () => {
      try {
        const result = await bookSession({
          mentorId: mentor.userId,
          slotId: selectedSlotId,
          type: selectedType,
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
        console.log("error", error);
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

            {/* Timezone Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Select
                value={timezone}
                onValueChange={(tz) => updateQueryParams("timezone", tz)}
              >
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
              disabled={!selectedDate || !selectedSlotId || isPending}
            >
              {isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
