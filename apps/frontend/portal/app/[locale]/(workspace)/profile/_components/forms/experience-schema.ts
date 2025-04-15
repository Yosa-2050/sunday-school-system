import { z } from 'zod';

export const experienceSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    company: z.string().min(2, 'Company must be at least 2 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    type: z.string().min(1, 'Employment type is required'),
    countryId: z.string().min(1, 'Country is required'),
    stateId: z.string().min(1, 'State is required'),
    cityId: z.string().min(1, 'City is required'),
    workPlace: z.string().min(1, 'Workplace is required'),
    description: z.string().optional(),
    currentlyWorking: z.boolean().default(false),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
