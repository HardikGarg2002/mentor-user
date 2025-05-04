import VideoCall from "@/components/booking/VideoCall";
import React from "react";

type SearchParams = Promise<{
  [meetingId: string]: string;
}>;

export default async function page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { meetingId } = await searchParams;
  // const meetingUrl = `https://vdo.ninja/?room=${meetingId || "aric-test"}`;
  const meetingUrl = `https://meet.jit.si/${meetingId || "aric-test"}?lang=en`;
  return <VideoCall meetingUrl={meetingUrl} />;
}
