import { z } from 'zod';

export const personalInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().min(1, 'Middle name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    birthDate: z.string().min(1, 'Birth date is required'),
    gender: z.string().min(1, 'Gender is required'),
    // marriageStatus: z.string().min(1, 'Marriage status is required'),
    title: z.string().min(1, 'Title is required'),
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\+?[0-9\s\-()]{10,20}$/, 'Invalid phone number format'),
    profile_picture_id: z.string().min(1, 'Profile picture ID is required'),
});

export const aboutSchema = z.object({
    bio: z.string(),
});

export const educationSchema = z.object({
    id: z.string().optional(),
    level: z.string().min(1, 'Level is required'),
    major: z.string().optional(),
    institution: z.string().min(1, 'Institution is required'),
    startYear: z.string().min(1, 'Start year is required'),
    endYear: z.string().min(1, 'End year is required'),
});

export const experienceSchema = z
    .object({
        id: z.string().optional(),
        title: z.string().min(1, 'Title is required'),
        company: z.string().min(1, 'Company is required'),
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().nullable(),
        currentlyWorking: z.boolean(),
        description: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.currentlyWorking) {
                return true;
            }
            return !!data.endDate;
        },
        {
            message: 'End date is required when not currently working',
            path: ['endDate'],
        },
    );

export const skillSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Skill name is required'),
});

export const skillsInputSchema = z.object({
    skills: z.array(z.string().min(1, 'Skill cannot be empty')),
});

export const coverLetterSchema = z.object({
    content: z.string(),
});
