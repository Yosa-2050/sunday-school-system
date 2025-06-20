import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Divider,
    Group,
    Modal,
    NumberInput,
    Select,
    TextInput,
    Textarea,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { updateOrganization } from 'app/[locale]/_api/organizations/updateOrganization';
import { getCookie } from 'cookies-next';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export const organizationSchema = z.object({
    registrationNumber: z.string().min(1, 'Required'),
    displayName: z.string().min(1, 'Required'),
    type: z.string().min(1, 'Required'),
    sectorId: z.string().min(1, 'Required'),
    yearFounded: z.number().int().min(1900).max(new Date().getFullYear()),
    companySize: z.string().min(1, 'Required'),
    description: z.string().optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

type AddOrganizationDetailProps = {
    opened: boolean;
    close: () => void;
    categories: { id: string; name: string }[];
    categoriesLoading: boolean;
};

export const AddOrganizationDetail = ({
    opened,
    close,
    categories,
    categoriesLoading,
}: AddOrganizationDetailProps) => {
    const id = getCookie('organization_id')?.toString();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<OrganizationFormData>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            registrationNumber: '',
            displayName: '',
            type: '',
            sectorId: '',
            yearFounded: new Date().getFullYear(),
            companySize: '',
            description: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: OrganizationFormData) =>
            updateOrganization(id ?? '', data),
        onSuccess: () => {
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
        <Modal
            opened={opened}
            onClose={close}
            title="Edit Organization"
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Title order={4} mb="xs">
                    General Info
                </Title>
                <Divider mb="sm" />

                <Controller
                    name="registrationNumber"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label="Registration Number"
                            required
                            error={errors.registrationNumber?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="displayName"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label="Display Name"
                            mt="sm"
                            error={errors.displayName?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label="Type"
                            mt="sm"
                            error={errors.type?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="sectorId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Sector"
                            placeholder="Select sector"
                            data={categories.map((cat) => ({
                                value: cat.id,
                                label: cat.name,
                            }))}
                            disabled={categoriesLoading}
                            mt="sm"
                            error={errors.sectorId?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="yearFounded"
                    control={control}
                    render={({ field }) => (
                        <NumberInput
                            label="Year Founded"
                            mt="sm"
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
                            mt="sm"
                            data={[
                                '1-10',
                                '11-50',
                                '51-200',
                                '201-500',
                                '500+',
                                'Small-sized: 10 to 49 employees',
                            ]}
                            error={errors.companySize?.message}
                            {...field}
                        />
                    )}
                />

                <Title order={4} mt="xl" mb="xs">
                    Description
                </Title>
                <Divider mb="sm" />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            label="Description"
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
        </Modal>
    );
};
