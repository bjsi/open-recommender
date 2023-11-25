import { z } from "zod";

export const assertValidSchema = (schema: z.ZodSchema<any>) => {
  return {
    type: "javascript",
    value: (output: any) => {
      const json = JSON.parse(output);
      const validation = schema.safeParse(json);
      if (!validation.success) {
        return {
          pass: false,
          score: 0,
          reason: validation.error.message,
        };
      } else {
        return {
          pass: true,
          score: 1,
          reason: "Successfully parsed JSON using zod schema.",
        };
      }
    },
  } as const;
};
