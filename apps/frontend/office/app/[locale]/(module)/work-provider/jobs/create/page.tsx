'use client';

import { RichTextInput } from '@/components/form/rich-text-input/RichTextInput';
import useIsAuthorized from '@/hooks/useIsAuthorized';
import { useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Container,
    Grid,
    Paper,
    Select,
    TextInput,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { logger } from '@shega/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from 'app/[locale]/_api/organizations/create-jobs';
import { memo } from 'react';
import {
    Controller,
    type ControllerRenderProps,
    type FieldError,
    useForm,
} from 'react-hook-form';
import { z } from 'zod';

const jobSchema = z
    .object({
        title: z.string().min(1, { message: 'Job title is required' }),
        type: z.string().min(1, { message: 'Job type is required' }),
        currency: z.string().min(1, { message: 'Currency is required' }),
        salaryFrom: z.coerce
            .number()
            .min(1, { message: 'Salary from must be at least 1' }),
        salaryTo: z.coerce
            .number()
            .min(1, { message: 'Salary to must be at least 1' }),
        location: z.string().optional(),
        description: z
            .string({ required_error: 'Description is required' })
            .min(30, {
                message: 'Description must be a minimum of 30 characters',
            }),
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

export type JobFormData = z.infer<typeof jobSchema>;

const MemoizedRichTextEditor = memo(
    ({
        field,
        error,
    }: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        field: ControllerRenderProps<any, any>;
        error: FieldError;
    }) => {
        return (
            <div className="relative mt-3">
                <RichTextInput
                    withAsterisk
                    className="w-full"
                    label="Description"
                    placeholder="Job Description"
                    field={field}
                    error={error}
                />
            </div>
        );
    },
);

MemoizedRichTextEditor.displayName = 'MemoizedRichTextEditor';

const PostJobForm = () => {
    const router = useRouter();
    const { user } = useIsAuthorized({
        resourceRole: 'work_provider',
        userRole: 'work_provider',
    });
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        getValues,
    } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
    });

    logger.log(errors);

    const queryClient = useQueryClient();

    const jobMutation = useMutation({
        mutationFn: createJob,
        mutationKey: ['jobs'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            notifications.show({
                title: 'Success',
                message: 'Job created successfully',
                color: 'green',
            });
            router.push('/work-provider/jobs');
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
            });
        },
    });

    const onSubmit = (data: JobFormData) => {
        jobMutation.mutate({
            ...data,
            organizationId: user?.organizationId ?? '',
        });
    };

    return (
        <Container size="xl">
            <Paper shadow="sm" radius="md" p="xl" className="mb-8">
                <div className="flex justify-between items-center mb-8">
                    <Title order={2}>Post New Job</Title>
                    <Button
                        variant="light"
                        color="gray"
                        onClick={() => router.back()}
                    >
                        Back to List
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TextInput
                        label="Job Title"
                        withAsterisk
                        placeholder="e.g. Senior Frontend Developer"
                        {...register('title')}
                        error={errors.title?.message}
                    />

                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Salary From"
                                placeholder="Minimum salary"
                                withAsterisk
                                type="number"
                                {...register('salaryFrom', {
                                    setValueAs: (v) =>
                                        v === '' ? undefined : Number(v),
                                })}
                                error={errors.salaryFrom?.message}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label="Salary To"
                                placeholder="Minimum salary"
                                withAsterisk
                                type="number"
                                {...register('salaryTo', {
                                    setValueAs: (v) =>
                                        v === '' ? undefined : Number(v),
                                })}
                                error={errors.salaryTo?.message}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Controller
                                name="currency"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select Currency"
                                        label="Currency"
                                        withAsterisk
                                        data={['ETB', 'USD', 'EUR', 'GBP']}
                                        allowDeselect={false}
                                        {...field}
                                        error={errors.currency?.message}
                                    />
                                )}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Controller
                                name="type"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        label="Employment Type"
                                        placeholder="Select Employment Type"
                                        allowDeselect={false}
                                        data={[
                                            {
                                                value: 'FULL_TIME',
                                                label: 'Full-time',
                                            },
                                            {
                                                value: 'PART_TIME',
                                                label: 'Part-time',
                                            },
                                            {
                                                value: 'CONTRACT',
                                                label: 'Contract',
                                            },
                                            {
                                                value: 'INTERNSHIP',
                                                label: 'Internship',
                                            },
                                        ]}
                                        {...field}
                                        error={errors.type?.message}
                                    />
                                )}
                            />
                        </Grid.Col>
                    </Grid>

                    <Controller
                        name="location"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select
                                label="Location"
                                placeholder="Job Location"
                                allowDeselect={false}
                                data={[
                                    'Addis Ababa',
                                    'Bahir Dar',
                                    'Hawassa',
                                    'Dire Dawa',
                                ]}
                                {...field}
                                error={errors.location?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name={'description'}
                        render={({ field }) => (
                            <MemoizedRichTextEditor
                                field={field}
                                error={
                                    errors.description ?? {
                                        message: '',
                                        type: 'error',
                                    }
                                }
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        size="md"
                        loading={jobMutation.isPending}
                        className="w-full"
                    >
                        Post Job
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default PostJobForm;
