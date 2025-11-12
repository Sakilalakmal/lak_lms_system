import { z } from "zod";

export const courseLevel = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "It & Software",
  "Personal Development",
  "design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Photography",
  "Teaching & Academics",
] as const;

// Input schema for form validation (all fields as they come from form inputs)
export const courseInputSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be at most 200 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(2500, { message: "Description must be at most 2500 characters" }),
  fileKey: z.string().min(1, { message: "File Key is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  level: z.enum(courseLevel, { message: "Level is required" }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters" })
    .max(200, { message: "Small Description must be at most 200 characters" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(100, { message: "Slug must be at most 100 characters" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
});

// Output schema for final validation after converting strings to numbers
export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be at most 200 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(2500, { message: "Description must be at most 2500 characters" }),
  fileKey: z.string().min(1, { message: "File Key is required" }),
  price: z.number().min(1, { message: "Price must be positive number" }),
  duration: z
    .number()
    .min(1, { message: "Duration must be Least 1 hour" })
    .max(50, { message: "Duration must be maximum 50 hours" }),
  level: z.enum(courseLevel, { message: "Level is required" }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters" })
    .max(200, { message: "Small Description must be at most 200 characters" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(100, { message: "Slug must be at most 100 characters" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
});

//chapter shcema
export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "courseId is required" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "courseId is required" }),
  chapterId: z.string().uuid({ message: "chapterId is required" }),
  description: z
    .string()
    .min(3, { message: "description must be at least 3 characters long" })
    .max(1000, { message: "description must be at most 1000 characters long" })
    .optional(),
  thumbnailKey: z
    .string()
    .min(1, { message: "thumbnailKey is required" })
    .optional(),
  videoKey: z.string().min(1, { message: "videoKey is required" }).optional(),
});

export type CourseInputType = z.infer<typeof courseInputSchema>;
export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
