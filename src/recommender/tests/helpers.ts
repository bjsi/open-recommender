import { z } from "zod";

export const assertJSON = <T>(
  schema: z.ZodSchema<T>,
  test: (data: T) => { pass: boolean; score: number; reason: string }
) => {
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
        return test(validation.data);
      }
    },
  } as const;
};

export const assertValidSchema = (schema: z.ZodSchema<any>) => {
  return assertJSON(schema, (data) => {
    return {
      pass: true,
      score: 1,
      reason: "Successfully parsed JSON using zod schema.",
    };
  });
};
