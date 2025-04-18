"use client";

import { useState } from "react";
import { Check, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSlot } from "@/types";

type TimeSlotPickerProps = {
  selectedSlotId?: string | null;
  availableSlots: TimeSlot[];
  onSelectSlot: (slot: TimeSlot) => void;
  className?: string;
};

export function TimeSlotPicker({
  selectedSlotId,
  availableSlots,
  onSelectSlot,
  className,
}: TimeSlotPickerProps) {
  const [open, setOpen] = useState(false);
  const selectedSlot = availableSlots.find(
    (slot) => slot.id === selectedSlotId
  );

  // Sort slots by start time
  const sortedSlots = [...availableSlots].sort((a, b) => {
    if (a.rawStartTime && b.rawStartTime) {
      return a.rawStartTime.localeCompare(b.rawStartTime);
    }
    return a.startTime.localeCompare(b.startTime);
  });

  // Group slots by availability
  const hasAvailableSlots = sortedSlots.some((slot) => !slot.isBooked);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedSlot && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedSlot ? (
            <span>
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </span>
          ) : (
            <span>Select time slot</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <ScrollArea className="h-72">
          <div className="grid gap-1 p-2">
            {sortedSlots.length === 0 ? (
              <div className="p-4 text-center">
                <Calendar className="mx-auto h-6 w-6 opacity-50 mb-2" />
                <p className="text-sm font-medium">
                  No availability for this date
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please select a different date
                </p>
              </div>
            ) : !hasAvailableSlots ? (
              <div className="p-4 text-center">
                <Calendar className="mx-auto h-6 w-6 opacity-50 mb-2" />
                <p className="text-sm font-medium">All slots are booked</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please select a different date
                </p>
              </div>
            ) : (
              <>
                {/* Optional header if we want to show a section header */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Available Time Slots
                </div>

                {sortedSlots.map((slot, i) => {
                  // Skip rendering booked slots or render them differently
                  if (slot.isBooked) {
                    return (
                      <div
                        key={i}
                        className="flex items-center px-2 py-1.5 text-sm bg-muted/50 text-muted-foreground border border-muted rounded-sm cursor-not-allowed"
                      >
                        <span className="mr-auto flex items-center">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-xs italic">Booked</span>
                      </div>
                    );
                  }

                  return (
                    <Button
                      key={i}
                      variant="ghost"
                      className={cn(
                        "justify-start font-normal",
                        selectedSlot?.id === slot.id &&
                          "bg-primary/10 font-medium"
                      )}
                      onClick={() => {
                        onSelectSlot(slot);
                        setOpen(false);
                      }}
                    >
                      <span className="mr-auto flex items-center">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {selectedSlot?.id === slot.id && (
                        <Check className="h-4 w-4 opacity-70" />
                      )}
                    </Button>
                  );
                })}
              </>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
