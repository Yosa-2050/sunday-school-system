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
            .min(37, { message: 'Description must be at least 30 characters' }),
        mentorshipType: z.coerce.number({ required_error: 'Membership Type is required' })
            .min(-1, { message: 'Please select a Membership Type' }),
        workPlace: z
            .string({ required_error: 'Work place type is required' })
            .min(1, { message: 'Please select a work place type' }),
        countryId: z
            .string({ required_error: 'Country is required' })
            .min(1, { message: 'Please select a country' }),
        stateId: z
            .string({ required_error: 'State is required' })
            .min(1, { message: 'Please select a state' }),
        cityId: z
            .string({ required_error: 'City is required' })
            .min(1, { message: 'Please select a city' }),
        experianceLevel: z.string( {
            required_error: 'Experience level is required',
            message:
                'ExperianceLevel must be one of the following values: ENTRY, MID, SENIOR',
        }),
        commitment: z
            .string({ required_error: 'Commitment is required' })
            .min(1, { message: 'Commitment is required' }),
        duration: z
            .number({ required_error: 'Duration is required' })
            .min(0, { message: 'Duration must be a positive number' }),
        numberOfApplicants: z
            .number()
            .min(1, { message: 'Number of applicants must be at least 1' })
            .optional(),
        audience: z
            .string()
            .min(1, { message: 'Audio is required' })
            .optional(),
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
