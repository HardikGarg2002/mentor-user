"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type MentorProfile, MentorExperience } from "@/types/mentor";
import { experienceSchema } from "@/lib/validations/mentor";
import { useState } from "react";
import { toast } from "sonner";
import { updateMentorProfile } from "@/actions/mentor-actions";

interface ExperienceFormProps {
  mentorProfile: MentorProfile;
}

export function ExperienceForm({ mentorProfile }: ExperienceFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Experience Form
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences:
        mentorProfile.experience.length > 0
          ? (mentorProfile.experience as any)
          : [{ company: "", role: "", period: "" }],
    },
  });

  const onSubmit = async (data: z.infer<typeof experienceSchema>) => {
    try {
      setIsSubmitting(true);

      // Ensure all fields are filled to satisfy MentorExperience type
      const validatedExperiences: MentorExperience[] = data.experiences.map(
        (exp) => ({
          company: exp.company || "",
          role: exp.role || "",
          period: exp.period || "",
        })
      );

      await updateMentorProfile(mentorProfile.userId, {
        experience: validatedExperiences,
      });

      toast.success("Experience updated", {
        description: "Your work experience has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Update failed", {
        description:
          "There was a problem updating your experience. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperienceField = () => {
    const experiences = form.getValues().experiences;
    form.setValue("experiences", [
      ...experiences,
      { company: "", role: "", period: "" },
    ]);
  };

  const removeExperienceField = (index: number) => {
    const experiences = form.getValues().experiences;
    if (experiences.length > 1) {
      form.setValue(
        "experiences",
        experiences.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            Your professional background and work history
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
              {form.watch("experiences").map((_, index) => (
                <div
                  key={index}
                  className="space-y-4 p-4 border rounded-md relative"
                >
                  <div className="absolute right-4 top-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperienceField(index)}
                      disabled={form.watch("experiences").length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Experience {index + 1}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Your position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.period`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2019 - Present" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperienceField}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Experience
                </Button>
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
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            {mentorProfile.experience.length > 0 ? (
              mentorProfile.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-muted pl-4 pb-4">
                  <h3 className="font-medium">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.company} • {exp.period}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No work experience added yet.
                </p>
                <Button className="mt-4" onClick={() => setIsEditing(true)}>
                  Add Experience
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
