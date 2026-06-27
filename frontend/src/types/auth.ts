import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email not valid"),
  password: z.string().min(1, "Password must be filled"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
