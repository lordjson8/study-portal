import { z } from "zod";

export const schema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(120, "Le titre est trop long"),
  description: z
    .string()
    .min(10, "Décrivez votre demande en au moins 10 caractères")
    .max(2000, "Description trop longue"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type FormValues = z.infer<typeof schema>;
