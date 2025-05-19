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
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type MentorProfile, MentorEducation } from "@/types/mentor";
import { educationSchema } from "@/lib/validations/mentor";
import { useState } from "react";
import { toast } from "sonner";
import { updateMentorProfile } from "@/actions/mentor-actions";

interface EducationFormProps {
  mentorProfile: MentorProfile;
}

export function EducationForm({ mentorProfile }: EducationFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Education Form
  const form = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations:
        mentorProfile.education.length > 0
          ? (mentorProfile.education as any)
          : [{ institution: "", degree: "", year: "" }],
    },
  });

  const onSubmit = async (data: z.infer<typeof educationSchema>) => {
    try {
      setIsSubmitting(true);

      // Ensure all fields are filled to satisfy MentorEducation type
      const validatedEducations: MentorEducation[] = data.educations.map(
        (edu) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          year: edu.year || "",
        })
      );

      await updateMentorProfile(mentorProfile.userId, {
        education: validatedEducations,
      });

      toast.success("Education updated", {
        description:
          "Your education information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Update failed", {
        description:
          "There was a problem updating your education. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEducationField = () => {
    const educations = form.getValues().educations;
    form.setValue("educations", [
      ...educations,
      { institution: "", degree: "", year: "" },
    ]);
  };

  const removeEducationField = (index: number) => {
    const educations = form.getValues().educations;
    if (educations.length > 1) {
      form.setValue(
        "educations",
        educations.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6">
        <div>
          <CardTitle>Education</CardTitle>
          <CardDescription>
            Your academic background and qualifications
          </CardDescription>
        </div>
        <Button
          variant={isEditing ? "ghost" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {form.watch("educations").map((_, index) => (
                <div
                  key={index}
                  className="space-y-4 p-4 border rounded-md relative"
                >
                  <div className="absolute right-4 top-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducationField(index)}
                      disabled={form.watch("educations").length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Education {index + 1}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`educations.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="University or institution name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`educations.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. B.S. Computer Science"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`educations.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2018" {...field} />
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
                  onClick={addEducationField}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Education
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
            {mentorProfile.education.length > 0 ? (
              mentorProfile.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-muted pl-4 pb-4">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution} • {edu.year}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No education information added yet.
                </p>
                <Button className="mt-4" onClick={() => setIsEditing(true)}>
                  Add Education
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
