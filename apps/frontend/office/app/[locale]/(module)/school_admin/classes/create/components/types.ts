import type { z } from 'zod';
import type { jobSchema } from './schema/job-schema';

export type JobFormData = z.infer<typeof jobSchema>;
