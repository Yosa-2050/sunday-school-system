import * as z from 'zod';

export enum JobDescriptionType {
    Benefits = 'BENEFITS',
    Requirements = 'REQUIREMENTS',
    Responsibility = 'RESPONSIBILITY',
}

export const jobDescriptionSchema = z.object({
    description: z.string(),
    type: z.nativeEnum(JobDescriptionType),
});

export const jobSchema = z
    .object({
        title: z
            .string({ required_error: 'Job title is required' })
            .min(3, { message: 'Job title must be at least 3 characters' }),
        description: z
            .string({ required_error: 'Description is required' })
            .min(30, { message: 'Description must be at least 30 characters' }),
        type: z.enum(['FULL_TIME', 'PART_TIME', 'Contract', 'Internship'], {
            required_error: 'Job type is required',
            message:
                'Type must be one of the following values: FULL_TIME, PART_TIME, Contract, Internship',
        }),
        workPlace: z
            .string({ required_error: 'Work place type is required' })
            .min(1, { message: 'Please select a work place type' }),
        salaryType: z
            .string({ required_error: 'Salary Type is required' })
            .min(1, { message: 'Please select a Salary type' }),
        currency: z.string().optional(),
        salaryFrequency: z.string().optional(),
        salaryFrom: z.coerce.number().optional(),
        salaryTo: z.coerce.number().optional(),
        countryId: z
            .string({ required_error: 'Country is required' })
            .min(1, { message: 'Please select a country' }),
        stateId: z
            .string({ required_error: 'State is required' })
            .min(1, { message: 'Please select a state' }),
        cityId: z
            .string({ required_error: 'City is required' })
            .min(1, { message: 'Please select a city' }),
        experianceLevel: z.enum(['ENTRY', 'MID', 'SENIOR'], {
            required_error: 'Experience level is required',
            message:
                'ExperianceLevel must be one of the following values: ENTRY, MID, SENIOR',
        }),
        experiance: z.coerce
            .number({ required_error: 'Years of experience is required' })
            .min(0, {
                message: 'Years of experience must be a positive number',
            }),
        deadline: z
            .date({ required_error: 'Deadline is required' })
            .refine((date) => date > new Date(), {
                message: 'Deadline must be a Date instance and in the future',
            }),
        educationalRequirment: z
            .string({ required_error: 'Educational requirement is required' })
            .min(1, { message: 'Please select an education requirement' }),
        skills: z
            .array(z.string(), { required_error: 'Skills are required' })
            .min(1, { message: 'Please select at least one required skill' }),
        catagories: z
            .array(z.string(), { required_error: 'Categories are required' })
            .min(1, { message: 'Please select at least one job category' }),
        isPublished: z.boolean({
            required_error: 'Publication status is required',
        }),
        contactEmail: z
            .string({ required_error: 'Contact email is required' })
            .email()
            .optional()
            .or(z.literal('')),
        applicationUrl: z
            .string({ required_error: 'Application URL is required' })
            .url()
            .optional()
            .or(z.literal('')),
        additionalInfo: z.string().optional(),
        jobDescriptions: z
            .array(jobDescriptionSchema, {
                required_error: 'Job descriptions are required',
            })
            .min(1, { message: 'Please add at least one job description' }),
    })
    .superRefine((data, ctx) => {
        if (data.salaryType === 'FIXED' || data.salaryType === 'RANGE') {
            if (!data.currency) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['currency'],
                    message:
                        'Currency is required for fixed or range salary types',
                });
            }
            if (!data.salaryFrequency) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['salaryFrequency'],
                    message:
                        'Salary frequency is required for fixed or range salary types',
                });
            }
            if (!data.salaryFrom || data.salaryFrom < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['salaryFrom'],
                    message:
                        'Minimum salary is required and must be at least 1',
                });
            }
        }

        if (
            data.salaryType === 'RANGE' &&
            (!data.salaryTo ||
                data.salaryTo < 1 ||
                (data.salaryFrom && data.salaryTo <= data.salaryFrom))
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['salaryTo'],
                message: 'Maximum salary must be greater than minimum salary',
            });
        }
    });
