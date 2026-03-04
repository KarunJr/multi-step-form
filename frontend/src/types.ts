import type React from "react";
import * as z from "zod";

const nationalities = ["Nepali", "Indian", "American"] as const;

export const shareholdersSchema = z.object({
  firstName: z.string().trim().min(1, "First Name is required"),
  lastName: z.string().trim().min(1, "Last Name is required"),
  nationality: z.enum(nationalities),
});

export const companySchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, "Company Name is required")
      .regex(/[A-Za-z]/, "Company Name must contain at least one letter"),
    panNumber: z.string().trim().regex(/^\d{9}$/, "PAN must be exactly 9 digits"),
    totalCapitalInvested: z
      .number()
      .positive("Total Capital Invested must be greater than 0"),
    numberOfShareholders: z
      .number()
      .positive("Number of shareholders must be greater than 0"),
    shareholders: z.array(shareholdersSchema).optional(),
  })
  .refine(
    (data) =>
      !data.shareholders ||
      data.shareholders.length === data.numberOfShareholders,
    {
      message:
        "Number of shareholder forms must match the number of shareholders",
      path: ["shareholders"],
    },
  );

export type CompanySchema = z.infer<typeof companySchema>;

export interface Step {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}
