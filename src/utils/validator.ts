import { z } from "zod";

export const signupValidator = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  address: z.string().min(3),
  password: z.string().min(8),
  bio: z.string().min(8).max(20).optional(),
  profilePicUrl: z.string().optional(),
});

export type SignupValidator = z.infer<typeof signupValidator>;

export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginValidator = z.infer<typeof loginValidator>;

export const updateProfileValidator = z.object({
  name: z.string().min(3).max(20).optional(),
  address: z.string().min(3).optional(),
  bio: z.string().min(8).max(20).optional(),
  profilePicUrl: z.string().optional(),
});

export type UpdateProfileValidator = z.infer<typeof updateProfileValidator>;
