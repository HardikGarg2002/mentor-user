"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createMentor, type MentorFormData } from "@/actions/mentor-actions";
import { Separator } from "@radix-ui/react-select";
import { PasswordInput } from "@/components/ui/password-input";

export function MentorApplicationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<MentorFormData>({
    name: "",
    email: "",
    password: "",
    title: "",
    about: "",
    specialties: [],
    experience: [{ company: "", role: "", period: "" }],
    education: [{ institution: "", degree: "", year: "" }],
    pricing: {
      chat: 50,
      video: 100,
      call: 80,
    },
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...((formData[parent as keyof MentorFormData] as Record<
            string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            any
          >) || {}),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle experience array changes
  const handleExperienceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      experience: updatedExperience,
    });
  };

  // Handle education array changes
  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: "", role: "", period: "" },
      ],
    });
  };

  // Remove experience entry
  const removeExperience = (index: number) => {
    if (formData.experience.length > 1) {
      const updatedExperience = [...formData.experience];
      updatedExperience.splice(index, 1);
      setFormData({
        ...formData,
        experience: updatedExperience,
      });
    }
  };

  // Add new education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: "", degree: "", year: "" },
      ],
    });
  };

  // Remove education entry
  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      const updatedEducation = [...formData.education];
      updatedEducation.splice(index, 1);
      setFormData({
        ...formData,
        education: updatedEducation,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createMentor(formData);

      if (result.success) {
        toast.success("Application Submitted", {
          description: result.message,
        });

        // Redirect to sign in page
        router.push("/auth/signin");
      } else {
        toast.error("Error", {
          description: result.error,
        });

        // If there are field errors, you could display them inline
        if (result.fieldErrors) {
          console.error("Field errors:", result.fieldErrors);
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Application</CardTitle>
        <CardDescription>
          Tell us about yourself and your expertise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Senior Software Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About You</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Share your background, experience, and what you can offer as a mentor..."
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum 50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Areas of Expertise</Label>
              <Input
                id="specialties"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                placeholder="React, Node.js, System Design (comma separated)"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter comma-separated values
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExperience}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {formData.experience.map((exp, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  {formData.experience.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experience-${index}-company`}>Company</Label>
                  <Input
                    id={`experience-${index}-company`}
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    placeholder="Company name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experience-${index}-role`}>Role</Label>
                  <Input
                    id={`experience-${index}-role`}
                    value={exp.role}
                    onChange={(e) =>
                      handleExperienceChange(index, "role", e.target.value)
                    }
                    placeholder="Your position"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experience-${index}-period`}>Period</Label>
                  <Input
                    id={`experience-${index}-period`}
                    value={exp.period}
                    onChange={(e) =>
                      handleExperienceChange(index, "period", e.target.value)
                    }
                    placeholder="e.g., 2018 - Present"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Education</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEducation}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>

            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  {formData.education.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`education-${index}-institution`}>
                    Institution
                  </Label>
                  <Input
                    id={`education-${index}-institution`}
                    value={edu.institution}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                    placeholder="University name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`education-${index}-degree`}>Degree</Label>
                  <Input
                    id={`education-${index}-degree`}
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    placeholder="e.g., B.S. Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`education-${index}-year`}>Year</Label>
                  <Input
                    id={`education-${index}-year`}
                    value={edu.year}
                    onChange={(e) =>
                      handleEducationChange(index, "year", e.target.value)
                    }
                    placeholder="e.g., 2016"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing</h3>
            <p className="text-sm text-muted-foreground">
              Set your hourly rates for different session types
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricing.chat">Chat Session (₹/hr)</Label>
                <Input
                  id="pricing.chat"
                  name="pricing.chat"
                  type="number"
                  value={formData.pricing.chat}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing.video">Video Call (₹/hr)</Label>
                <Input
                  id="pricing.video"
                  name="pricing.video"
                  type="number"
                  value={formData.pricing.video}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing.call">Phone Call (₹/hr)</Label>
                <Input
                  id="pricing.call"
                  name="pricing.call"
                  type="number"
                  value={formData.pricing.call}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
