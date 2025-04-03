import type { z } from "zod";
import type { jobSchema } from "./shcema/job-schema";

export type JobFormData = z.infer<typeof jobSchema>;
