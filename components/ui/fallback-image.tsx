"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FallbackImageProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  text?: string;
}

export function FallbackImage({
  className,
  text = "No Image",
  ...props
}: FallbackImageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-muted rounded-lg",
        className
      )}
      {...props}
    >
      <ImageIcon className="h-8 w-8 text-muted-foreground" />
      <span className="mt-2 text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
