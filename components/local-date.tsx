"use client";

import { format } from "date-fns";

export default function LocalDate({ date }: { date: Date }) {
  return <div>{format(date, "MMM d, yyyy")}</div>;
}
