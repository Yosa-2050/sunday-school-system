import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Divider,
    Drawer,
    Group,
    Select,
    TextInput,
    Textarea,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetIndustry } from 'app/[locale]/_api/fetch-lookup';
import { updateOrganization } from 'app/[locale]/_api/organizations/updateOrganization';
import { getCookie } from 'cookies-next';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export const organizationSchema = z.object({
    registrationNumber: z.string().min(1, 'Required'),
    type: z.string().min(1, 'Required'),
    industryId: z.string().min(1, 'Required'),
    yearFounded: z
        .string()
        .refine((val) => val?.length === 4 && /^\d+$/.test(val), {
            message: 'Year founded should be a four digit number',
        })
        .refine(
            (val) => {
                const num = Number(val);
                return num >= 1900 && num <= new Date().getFullYear();
            },
            { message: 'Year founded should be between 1900 and current year' },
        ),
    companySize: z.string().min(1, 'Required'),
    description: z.string().optional(),
    corporateEmail: z.string().email().optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

type AddOrganizationDetailProps = {
    opened: boolean;
    close: () => void;
    categories: { id: string; name: string }[];
    categoriesLoading: boolean;
    defaultValues: OrganizationFormData;
};

export const AddOrganizationDetail = ({
    opened,
    close,
    categories,
    categoriesLoading,
    defaultValues,
}: AddOrganizationDetailProps) => {
    const queryClient = useQueryClient();
    const id = getCookie('organization_id')?.toString();
    const { data: industries } = useGetIndustry();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<OrganizationFormData>({
        resolver: zodResolver(organizationSchema),
        defaultValues: defaultValues ?? {
            registrationNumber: '',
            type: '',
            industryId: '',
            yearFounded: new Date().getFullYear(),
            companySize: '',
            description: '',
            corporateEmail: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: OrganizationFormData) =>
            updateOrganization(id ?? '', {
                ...data,
                yearFounded: Number(data.yearFounded),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organization_id', id],
            });
            queryClient.invalidateQueries({
                queryKey: ['can_organization_submit'],
            });
            notifications.show({
                title: 'Success',
                message: 'Organization updated successfully',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });
            reset();
            close();
        },
    });

    const onSubmit = (data: OrganizationFormData) => mutation.mutate(data);

    return (
        <Drawer
            opened={opened}
            onClose={close}
            title="Update Organization"
            size="md"
            position="right"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Title order={6} mb="xs">
                    General Info
                </Title>
                <Divider mb="sm" />

                <Controller
                    name="registrationNumber"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label="Business Registration Number"
                            placeholder="Enter registration number"
                            required
                            error={errors.registrationNumber?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Type"
                            placeholder="Select type"
                            required
                            mt="sm"
                            data={[
                                {
                                    value: 'Sole proprietorship',
                                    label: 'Sole proprietorship',
                                },
                                { value: 'Partnership', label: 'Partnership' },
                                {
                                    value: 'Limited Liability Company (LLC)',
                                    label: 'Limited Liability Company (LLC)',
                                },
                                { value: 'Plc', label: 'Plc' },
                                { value: 'S.C.', label: 'S.C.' },
                                { value: 'Non-Profit', label: 'Non-Profit' },
                                {
                                    value: 'Joint Venture',
                                    label: 'Joint Venture',
                                },
                                { value: 'Cooperative', label: 'Cooperative' },
                                { value: 'Other', label: 'Other' },
                            ]}
                            error={errors.type?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="industryId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Sector"
                            placeholder="Select sector"
                            data={(industries ?? []).map((cat) => ({
                                value: cat.id,
                                label: cat.value,
                            }))}
                            disabled={categoriesLoading}
                            mt="sm"
                            error={errors.industryId?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="corporateEmail"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label="Corporate Email"
                            placeholder="Enter corporate email"
                            mt="sm"
                            required
                            error={errors.corporateEmail?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="yearFounded"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label="Year Founded"
                            placeholder="Enter year founded"
                            mt="sm"
                            required
                            error={errors.yearFounded?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="companySize"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Company Size"
                            placeholder="Select company size"
                            mt="sm"
                            required
                            data={[
                                'Micro-sized: 1 to 9 employees',

                                'Small-sized: 10 to 49 employees',

                                'Medium-sized: 50 to 249 employees',

                                'Large-sized: 250+ employees',
                            ]}
                            error={errors.companySize?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            label="Description"
                            placeholder="Enter description"
                            mt="sm"
                            error={errors.description?.message}
                            {...field}
                        />
                    )}
                />

                <Group justify="flex-end" mt="lg">
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={mutation.isPending}>
                        Save
                    </Button>
                </Group>
            </form>
        </Drawer>
    );
};
