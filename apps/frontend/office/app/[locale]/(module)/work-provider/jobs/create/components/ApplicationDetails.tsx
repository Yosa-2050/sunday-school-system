import { Grid, Textarea } from '@mantine/core';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { MemoizedRichTextEditor } from './MemoizedRichTextEditor';
import type { JobFormData } from './types';

interface ApplicationDetailsProps {
    control: Control<JobFormData>;
    errors: FieldErrors<JobFormData>;
}

export const ApplicationDetails = ({
    control,
    errors,
}: ApplicationDetailsProps) => {
    return (
        <Grid>
            <Grid.Col span={{ base: 12 }}>
                <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <MemoizedRichTextEditor
                            field={field}
                            error={
                                errors.description ?? {
                                    message: '',
                                    type: 'error',
                                }
                            }
                            label="Job Description"
                            placeholder="Detailed job description"
                        />
                    )}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
                <Controller
                    control={control}
                    name="additionalInfo"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            error={errors.additionalInfo?.message}
                            label="Additional Information"
                            placeholder="Any additional information about the job"
                            autosize
                            minRows={4}
                            maxRows={8}
                        />
                    )}
                />
            </Grid.Col>
        </Grid>
    );
};
