import { z } from "zod";

export const createGameSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "O título precisa ter pelo menos 3 caracteres.")
      .refine((val) => !!val, { message: "O título é obrigatório." }),
    platform: z
      .string()
      .refine((val) => !!val, { message: "A plataforma é obrigatória." }),
  }),
});

export const updateGameSchema = createGameSchema;
