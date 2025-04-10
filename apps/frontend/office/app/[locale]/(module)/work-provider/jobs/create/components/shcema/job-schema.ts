import * as z from 'zod';

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
        currency: z
            .string({ required_error: 'Currency is required' })
            .min(1, { message: 'Please select a currency' }),
        salaryFrom: z.coerce
            .number({ required_error: 'Minimum salary is required' })
            .min(1, { message: 'Minimum salary must be at least 1' }),
        salaryTo: z.coerce
            .number({ required_error: 'Maximum salary is required' })
            .min(1, { message: 'Maximum salary must be at least 1' }),
        salaryFrequency: z
            .string({ required_error: 'Salary frequency is required' })
            .min(1, { message: 'Please select a salary frequency' }),
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
    })
    .superRefine((data, ctx) => {
        if (data.salaryTo <= data.salaryFrom) {
            ctx.addIssue({
                code: 'custom',
                message: 'Salary to must be greater than salary from',
                path: ['salaryTo'],
            });
        }
    });
