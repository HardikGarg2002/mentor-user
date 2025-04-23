"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, MessageSquare, Phone, Video } from "lucide-react";
import { type MentorProfile } from "@/types/mentor";
import { pricingSchema } from "@/lib/validations/mentor";
import { useState } from "react";
import { toast } from "sonner";
import { updateMentorProfile } from "@/actions/mentor-actions";

interface PricingFormProps {
  mentorProfile: MentorProfile;
}

export function PricingForm({ mentorProfile }: PricingFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing Form
  const form = useForm<z.infer<typeof pricingSchema>>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      chat: mentorProfile.pricing.chat,
      video: mentorProfile.pricing.video,
      call: mentorProfile.pricing.call,
    },
  });

  const onSubmit = async (data: z.infer<typeof pricingSchema>) => {
    try {
      setIsSubmitting(true);
      await updateMentorProfile(mentorProfile.userId, {
        pricing: {
          chat: data.chat,
          video: data.video,
          call: data.call,
        },
      });

      toast.success("Pricing updated", {
        description: "Your session pricing has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating pricing:", error);
      toast.error("Update failed", {
        description:
          "There was a problem updating your pricing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Session Pricing</CardTitle>
          <CardDescription>
            Set your rates for different session types
          </CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="chat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chat Rate (per hour)</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          $
                        </span>
                        <FormControl>
                          <Input type="number" className="pl-7" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Price for text-based chat sessions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Call Rate (per hour)</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          $
                        </span>
                        <FormControl>
                          <Input type="number" className="pl-7" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Price for video call sessions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="call"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Call Rate (per hour)</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          $
                        </span>
                        <FormControl>
                          <Input type="number" className="pl-7" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Price for audio call sessions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-md">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Chat Sessions</h3>
                </div>
                <p className="text-2xl font-bold">
                  ${mentorProfile.pricing.chat}
                  <span className="text-sm font-normal text-muted-foreground">
                    /hr
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Text-based mentoring through our platform's chat.
                </p>
              </div>

              <div className="p-4 border rounded-md">
                <div className="flex items-center mb-2">
                  <Video className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Video Sessions</h3>
                </div>
                <p className="text-2xl font-bold">
                  ${mentorProfile.pricing.video}
                  <span className="text-sm font-normal text-muted-foreground">
                    /hr
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Face-to-face video calls for in-depth mentoring.
                </p>
              </div>

              <div className="p-4 border rounded-md">
                <div className="flex items-center mb-2">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Call Sessions</h3>
                </div>
                <p className="text-2xl font-bold">
                  ${mentorProfile.pricing.call}
                  <span className="text-sm font-normal text-muted-foreground">
                    /hr
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Audio calls for convenient mentoring on the go.
                </p>
              </div>
            </div>

            <Alert className="bg-muted">
              <Check className="h-4 w-4" />
              <AlertTitle>Pricing Tips</AlertTitle>
              <AlertDescription>
                Setting competitive rates can help you attract more mentees.
                Consider your experience level and the market when pricing your
                sessions.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
