"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { type MentorProfile } from "@/types/mentor";
import { basicInfoSchema } from "@/lib/validations/mentor";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateMentorProfile } from "@/actions/mentor-actions";

interface BasicInfoFormProps {
  mentorProfile: MentorProfile;
}

export function BasicInfoForm({ mentorProfile }: BasicInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info Form
  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: mentorProfile.title,
      about: mentorProfile.about,
      specialties: mentorProfile.specialties.join(", "),
    },
  });

  const onSubmit = async (data: z.infer<typeof basicInfoSchema>) => {
    try {
      setIsSubmitting(true);
      // Convert comma-separated specialties to array
      const specialties = data.specialties
        .split(",")
        .map((specialty) => specialty.trim())
        .filter(Boolean);

      await updateMentorProfile(mentorProfile.userId, {
        title: data.title,
        about: data.about,
        specialties,
      });

      toast.success("Profile updated", {
        description: "Your basic information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update failed", {
        description:
          "There was a problem updating your profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your professional title and bio</CardDescription>
        </div>
        <Button
          variant={isEditing ? "ghost" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Senior Software Engineer"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your professional title will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell mentees about your background, expertise, and mentoring style..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write a compelling bio that highlights your expertise and
                      experience.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. React, Node.js, System Design (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your areas of expertise, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-1">Professional Title</h3>
              <p>{mentorProfile.title}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">About</h3>
              <p className="text-muted-foreground">{mentorProfile.about}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-1">
                {mentorProfile.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
