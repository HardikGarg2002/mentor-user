"use client";

import { format } from "date-fns";

export default function LocalDate({ date }: { date: Date | string }) {
  return <span>{format(date, "MMM d, yyyy")}</span>;
}
