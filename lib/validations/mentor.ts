import * as z from "zod";

export const basicInfoSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  about: z
    .string()
    .min(10, { message: "About must be at least 10 characters." }),
  specialties: z
    .string()
    .min(2, { message: "Please enter at least one specialty." }),
});

export const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(1, { message: "Company name is required." }),
      role: z.string().min(1, { message: "Role is required." }),
      period: z.string().min(1, { message: "Period is required." }),
    })
  ),
});

export const educationSchema = z.object({
  educations: z.array(
    z.object({
      institution: z
        .string()
        .min(1, { message: "Institution name is required." }),
      degree: z.string().min(1, { message: "Degree is required." }),
      year: z.string().min(1, { message: "Year is required." }),
    })
  ),
});

export const pricingSchema = z.object({
  chat: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number." }),
  video: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number." }),
  call: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number." }),
});
