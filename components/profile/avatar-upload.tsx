"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Pencil, Loader2 } from "lucide-react";
import { updateMentorProfileImage } from "@/actions/mentor-actions";
import { FallbackImage } from "@/components/ui/fallback-image";
import Image from "next/image";

interface AvatarUploadProps {
  initialImage?: string;
  name: string;
  userId: string;
}

export function AvatarUpload({
  initialImage,
  name,
  userId,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpdate = async (imageUrl: string) => {
    await updateMentorProfileImage(userId, imageUrl);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPEG, PNG, etc.)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image must be less than 5MB",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "mentor_avatars"
      );
      formData.append("folder", "mentor_profiles");
      formData.append("public_id", `user_${userId}`);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update state
      setImage(imageUrl);

      // Call callback to save URL to database
      await handleImageUpdate(imageUrl);

      toast.success("Image uploaded", {
        description: "Your profile image has been updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Upload failed", {
        description:
          "There was a problem uploading your image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <Avatar className="h-32 w-32">
        {image ? (
          <Image
            src={image}
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        ) : (
          <FallbackImage className="w-32 h-32 rounded-full" text="Profile" />
        )}
        {/* <AvatarFallback className="text-4xl">{name.charAt(0)}</AvatarFallback> */}
      </Avatar>

      <Button
        size="sm"
        variant="outline"
        className="absolute bottom-0 right-0 rounded-full p-2 h-auto"
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        aria-label="Upload profile image"
      />
    </div>
  );
}
