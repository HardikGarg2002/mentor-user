"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Briefcase,
  Check,
  ChevronLeft,
  GraduationCap,
  MessageSquare,
  Phone,
  Plus,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";
import { MentorProfile, type MentorProfilePageProps } from "@/types/mentor";
import {
  basicInfoSchema,
  experienceSchema,
  educationSchema,
  pricingSchema,
} from "@/lib/validations/mentor";

export function MentorProfilePage({
  mentorProfile,
}: {
  mentorProfile: MentorProfile;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Basic Info Form
  const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: mentorProfile.title,
      about: mentorProfile.about,
      specialties: mentorProfile.specialties.join(", "),
    },
  });

  // Experience Form
  const experienceForm = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences:
        mentorProfile.experience.length > 0
          ? mentorProfile.experience
          : [{ company: "", role: "", period: "" }],
    },
  });

  // Education Form
  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations:
        mentorProfile.education.length > 0
          ? mentorProfile.education
          : [{ institution: "", degree: "", year: "" }],
    },
  });

  // Pricing Form
  const pricingForm = useForm<z.infer<typeof pricingSchema>>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      chat: mentorProfile.pricing.chat,
      video: mentorProfile.pricing.video,
      call: mentorProfile.pricing.call,
    },
  });

  // Form submission handlers
  const onBasicInfoSubmit = (data: z.infer<typeof basicInfoSchema>) => {
    console.log("Basic Info Form submitted:", data);
    // In a real app, this would send the data to an API
    toast.success("Profile updated", {
      description: "Your basic information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const onExperienceSubmit = (data: z.infer<typeof experienceSchema>) => {
    console.log("Experience Form submitted:", data);
    // In a real app, this would send the data to an API
    toast.success("Experience updated", {
      description: "Your work experience has been updated successfully.",
    });
    setIsEditing(false);
  };

  const onEducationSubmit = (data: z.infer<typeof educationSchema>) => {
    console.log("Education Form submitted:", data);
    // In a real app, this would send the data to an API
    toast.success("Education updated", {
      description: "Your education information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const onPricingSubmit = (data: z.infer<typeof pricingSchema>) => {
    console.log("Pricing Form submitted:", data);
    // In a real app, this would send the data to an API
    toast.success("Pricing updated", {
      description: "Your session pricing has been updated successfully.",
    });
    setIsEditing(false);
  };

  // Add/remove form fields
  const addExperienceField = () => {
    const experiences = experienceForm.getValues().experiences;
    experienceForm.setValue("experiences", [
      ...experiences,
      { company: "", role: "", period: "" },
    ]);
  };

  const removeExperienceField = (index: number) => {
    const experiences = experienceForm.getValues().experiences;
    if (experiences.length > 1) {
      experienceForm.setValue(
        "experiences",
        experiences.filter((_, i) => i !== index)
      );
    }
  };

  const addEducationField = () => {
    const educations = educationForm.getValues().educations;
    educationForm.setValue("educations", [
      ...educations,
      { institution: "", degree: "", year: "" },
    ]);
  };

  const removeEducationField = (index: number) => {
    const educations = educationForm.getValues().educations;
    if (educations.length > 1) {
      educationForm.setValue(
        "educations",
        educations.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Mentor Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={
                        mentorProfile.image ||
                        "/placeholder.svg?height=128&width=128&query=person"
                      }
                      alt={mentorProfile.name}
                    />
                    <AvatarFallback className="text-4xl">
                      {mentorProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    Edit
                  </Button>
                </div>
                <h2 className="text-2xl font-bold mt-4">
                  {mentorProfile.name}
                </h2>
                <p className="text-muted-foreground">{mentorProfile.title}</p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">
                    {mentorProfile.rating}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({mentorProfile.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
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

                <div>
                  <h3 className="font-medium mb-2">Session Types</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                        <span>Chat</span>
                      </div>
                      <span className="font-medium">
                        ${mentorProfile.pricing.chat}/hr
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2 text-primary" />
                        <span>Video</span>
                      </div>
                      <span className="font-medium">
                        ${mentorProfile.pricing.video}/hr
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <span>Call</span>
                      </div>
                      <span className="font-medium">
                        ${mentorProfile.pricing.call}/hr
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Profile Completion</h3>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your profile is 85% complete
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Profile Visibility</AlertTitle>
                <AlertDescription>
                  Your profile is currently visible to potential mentees. You
                  can toggle visibility in settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Your professional title and bio
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
                    <Form {...basicInfoForm}>
                      <form
                        onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={basicInfoForm.control}
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
                                Your professional title will be displayed on
                                your profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={basicInfoForm.control}
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
                                Write a compelling bio that highlights your
                                expertise and experience.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={basicInfoForm.control}
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
                                Enter your areas of expertise, separated by
                                commas.
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
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
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
                        <p className="text-muted-foreground">
                          {mentorProfile.about}
                        </p>
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
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience">
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
                    <Form {...experienceForm}>
                      <form
                        onSubmit={experienceForm.handleSubmit(
                          onExperienceSubmit
                        )}
                        className="space-y-6"
                      >
                        {experienceForm.watch("experiences").map((_, index) => (
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
                                disabled={
                                  experienceForm.watch("experiences").length ===
                                  1
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <Briefcase className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">
                                Experience {index + 1}
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={experienceForm.control}
                                name={`experiences.${index}.company`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Company name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={experienceForm.control}
                                name={`experiences.${index}.role`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your position"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={experienceForm.control}
                              name={`experiences.${index}.period`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Period</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. 2019 - Present"
                                      {...field}
                                    />
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
                            <Plus className="h-4 w-4 mr-2" /> Add Another
                            Experience
                          </Button>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      {mentorProfile.experience.length > 0 ? (
                        mentorProfile.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-muted pl-4 pb-4"
                          >
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
                          <Button
                            className="mt-4"
                            onClick={() => setIsEditing(true)}
                          >
                            Add Experience
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
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
                <CardContent>
                  {isEditing ? (
                    <Form {...educationForm}>
                      <form
                        onSubmit={educationForm.handleSubmit(onEducationSubmit)}
                        className="space-y-6"
                      >
                        {educationForm.watch("educations").map((_, index) => (
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
                                disabled={
                                  educationForm.watch("educations").length === 1
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <GraduationCap className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">
                                Education {index + 1}
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={educationForm.control}
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
                                control={educationForm.control}
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
                              control={educationForm.control}
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
                            <Plus className="h-4 w-4 mr-2" /> Add Another
                            Education
                          </Button>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      {mentorProfile.education.length > 0 ? (
                        mentorProfile.education.map((edu, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-muted pl-4 pb-4"
                          >
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
                          <Button
                            className="mt-4"
                            onClick={() => setIsEditing(true)}
                          >
                            Add Education
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing">
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
                    <Form {...pricingForm}>
                      <form
                        onSubmit={pricingForm.handleSubmit(onPricingSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={pricingForm.control}
                            name="chat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Chat Rate (per hour)</FormLabel>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    $
                                  </span>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      className="pl-7"
                                      {...field}
                                    />
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
                            control={pricingForm.control}
                            name="video"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Video Call Rate (per hour)
                                </FormLabel>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    $
                                  </span>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      className="pl-7"
                                      {...field}
                                    />
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
                            control={pricingForm.control}
                            name="call"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Phone Call Rate (per hour)
                                </FormLabel>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    $
                                  </span>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      className="pl-7"
                                      {...field}
                                    />
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
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
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
                          Setting competitive rates can help you attract more
                          mentees. Consider your experience level and the market
                          when pricing your sessions.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
