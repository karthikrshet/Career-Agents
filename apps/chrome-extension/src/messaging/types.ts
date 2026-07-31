// apps/chrome-extension/src/messaging/types.ts
import { z } from "zod";

export const JobDetailsSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  experience: z.string().optional(),
  employmentType: z.string().optional(),
  text: z.string(),
  url: z.string().optional(),
});

export type JobDetails = z.infer<typeof JobDetailsSchema>;

export const AutofillProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  workAuth: z.string().optional(),
});

export type AutofillProfile = z.infer<typeof AutofillProfileSchema>;

export const ExtensionMessageSchema = z.discriminatedUnion("type", [
  {
    type: z.literal("EXTRACT_JOB_REQUEST"),
  },
  {
    type: z.literal("EXTRACT_JOB_RESPONSE"),
    payload: JobDetailsSchema,
  },
  {
    type: z.literal("AUTOFILL_FORM_REQUEST"),
    payload: AutofillProfileSchema,
  },
  {
    type: z.literal("AUTOFILL_FORM_RESPONSE"),
    payload: z.object({
      success: z.boolean(),
      filledCount: z.number(),
    }),
  }
].map(item => z.object(item) as any) as any);

export type ExtensionMessage = {
  type: "EXTRACT_JOB_REQUEST" | "EXTRACT_JOB_RESPONSE" | "AUTOFILL_FORM_REQUEST" | "AUTOFILL_FORM_RESPONSE";
  payload?: any;
};
