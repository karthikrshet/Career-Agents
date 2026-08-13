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
  currentRole: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  education: z.string().optional(),
  visaSponsorship: z.string().optional(),
  expectedSalary: z.string().optional(),
  primarySkills: z.string().optional(),
});

export type AutofillProfile = z.infer<typeof AutofillProfileSchema>;

export interface CodeReviewPayload {
  title: string;
  problemText: string;
  codeSnippet: string;
  language: string;
  url: string;
}

export interface LiveInterviewPayload {
  question: string;
  agentId: string;
  company?: string;
  role?: string;
}

export type ExtensionMessage = {
  type:
    | "EXTRACT_JOB_REQUEST"
    | "EXTRACT_JOB_RESPONSE"
    | "AUTOFILL_FORM_REQUEST"
    | "AUTOFILL_FORM_RESPONSE"
    | "EXTRACT_CODE_PROBLEM_REQUEST"
    | "EXTRACT_CODE_PROBLEM_RESPONSE"
    | "GENERATE_STAR_ANSWER_REQUEST"
    | "GENERATE_STAR_ANSWER_RESPONSE";
  payload?: any;
};
