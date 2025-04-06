"use client";
import React from "react";

export default function VideoCall({ meetingUrl }: { meetingUrl: string }) {
  return (
    <iframe
      title="video call"
      src={meetingUrl}
      width="100%"
      height="600px"
      allow="camera; microphone; fullscreen;"
    />
  );
}
