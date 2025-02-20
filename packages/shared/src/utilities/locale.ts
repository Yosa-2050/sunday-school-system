import { z } from 'zod';

export type LocaleKey = 'am' | 'en' | 'om' | 'ti' | 'so' | 'sw' | 'fr' | 'ar';
export type Locale = {
    [key in LocaleKey | string]?: string;
};
export type Translation = (key: string) => string;

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGE = [
    ['en', 'English', 'en'],
    ['am', 'አማርኛ', 'አማ'],
    ['ar', 'العربية', 'ar'],
    // ['om', 'Afaan Oromo', 'Om'],
    // ['ti', 'ትግሪኛ'],
    // ['so', 'Somali'],
    // ['sw', 'kiswahili'],
];

export const LOCALE_INPUT_DEFAULT = Object.fromEntries(
    SUPPORTED_LANGUAGE.map(([key]) => [key, '']),
);

// Define the type for the accumulator to allow string keys with Zod schema values
type SchemaAccumulator = {
    [key: string]: z.ZodTypeAny;
};

export function createLocalInputSchema(
    defaultValidation: z.ZodTypeAny,
    otherValidation: z.ZodTypeAny,
): z.ZodObject<SchemaAccumulator> {
    const schemaDefinition: { [key: string]: z.ZodTypeAny } =
        SUPPORTED_LANGUAGE.reduce((acc: SchemaAccumulator, [key]) => {
            if (!key) {
                return acc;
            }
            acc[key] =
                key === DEFAULT_LANGUAGE ? defaultValidation : otherValidation;
            return acc;
        }, {});

    return z.object(schemaDefinition);
}

export const LOCALE_REQUIRED_INPUT_SCHEMA = createLocalInputSchema(
    z.string().trim().min(1, { message: 'This field is required' }),
    z.string().optional(),
);

export const localeRequiredInputSchema = (t?: Translation) =>
    createLocalInputSchema(
        z
            .string()
            .trim()
            .min(1, { message: t ? t('fieldRequired') : 'fieldRequired' }),
        z.string().optional(),
    );

export const LOCALE_OPTIONAL_INPUT_SCHEMA = createLocalInputSchema(
    z.string().optional(),
    z.string().optional(),
);

export const SUPPORTED_LANGUAGES = [
    { value: 'en', label: 'English', key: 'En' },
    { value: 'am', label: 'አማርኛ', key: 'አማ' },
    { value: 'ar', label: 'العربية', key: 'ال' },
];
