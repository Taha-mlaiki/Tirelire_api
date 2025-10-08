import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(3, "fisrtName must at least contain 3 characters"),
  lastName: z.string().min(3, "LastName must at least contain 3 characters"),
  email: z.email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
});
