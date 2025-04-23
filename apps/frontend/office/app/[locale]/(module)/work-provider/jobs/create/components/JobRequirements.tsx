import {
    ActionIcon,
    Button,
    Checkbox,
    Divider,
    Grid,
    Group,
    MultiSelect,
    NumberInput,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
    type JSXElementConstructor,
    type ReactElement,
    type ReactNode,
    type ReactPortal,
    useState,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { JobDescriptionType } from './shcema/job-schema';
import type { JobFormData } from './types';
import { mapEnumToOptions } from './utils';

interface JobRequirementsProps {
    categories: { id: string; name: string }[];
    skills: { id: string; name: string }[];
    educationalRequirmentTypes: { data: Record<string, string> };
}

export const JobRequirements = ({
    categories,
    skills,
    educationalRequirmentTypes,
}: JobRequirementsProps) => {
    const {
        control,
        formState: { errors },
        setValue,
    } = useFormContext<JobFormData>();

    const [tempBenefits, setTempBenefits] = useState('');
    const [tempRequirements, setTempRequirements] = useState('');
    const [tempResponsibilities, setTempResponsibilities] = useState('');
    const [editingItem, setEditingItem] = useState<{
        type: JobDescriptionType;
        index: number;
        value: string;
    } | null>(null);

    const handleAddItems = (type: JobDescriptionType, value: string) => {
        if (!value.trim()) {
            return;
        }
        const currentItems = control._getWatch('jobDescriptions') || [];
        setValue('jobDescriptions', [
            ...currentItems,
            { description: value.trim(), type },
        ]);
    };

    const handleDeleteItem = (type: JobDescriptionType, index: number) => {
        const currentItems = control._getWatch('jobDescriptions') || [];
        const newItems = currentItems.filter(
            (
                item: { type: JobDescriptionType; description: string },
                i: number,
            ) => i !== index,
        );
        setValue('jobDescriptions', newItems);
    };

    const handleEditItem = (
        type: JobDescriptionType,
        index: number,
        value: string,
    ) => {
        setEditingItem({ type, index, value });
    };

    const handleSaveEdit = () => {
        if (!editingItem) {
            return;
        }
        const currentItems = control._getWatch('jobDescriptions') || [];
        const newItems = [...currentItems];
        newItems[editingItem.index] = {
            description: editingItem.value,
            type: editingItem.type,
        };
        setValue('jobDescriptions', newItems);
        setEditingItem(null);
    };

    const renderListItems = (type: JobDescriptionType, label: string) => {
        const items = (control._getWatch('jobDescriptions') || []).filter(
            (item: { type: JobDescriptionType }) => item.type === type,
        );

        if (items.length === 0) {
            return null;
        }

        return (
            <Paper
                withBorder
                p="xs"
                mt="xs"
                style={{ maxHeight: '200px', overflow: 'auto' }}
            >
                <Text size="xs" c="dimmed" mb="xs">
                    {items.length} {label}
                </Text>
                <Stack gap="xs">
                    {items.map(
                        (
                            item: {
                                type: JobDescriptionType;
                                description:
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    | ReactElement<
                                          unknown,
                                          string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | Promise<
                                          | string
                                          | number
                                          | bigint
                                          | boolean
                                          | ReactPortal
                                          | ReactElement<
                                                unknown,
                                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                | string
                                                | JSXElementConstructor<any>
                                            >
                                          | Iterable<ReactNode>
                                          | null
                                          | undefined
                                      >
                                    | null
                                    | undefined;
                            },
                            index: number,
                        ) => (
                            <Group
                                key={`${item.type}-${index}`}
                                gap="xs"
                                wrap="nowrap"
                            >
                                <Checkbox checked={true} readOnly />
                                {editingItem?.type === type &&
                                editingItem?.index === index ? (
                                    <Group gap="xs" style={{ flex: 1 }}>
                                        <TextInput
                                            value={editingItem.value}
                                            onChange={(e) =>
                                                setEditingItem({
                                                    ...editingItem,
                                                    value: e.target.value,
                                                })
                                            }
                                            size="xs"
                                            style={{ flex: 1 }}
                                        />
                                        <Button
                                            size="xs"
                                            onClick={handleSaveEdit}
                                        >
                                            Save
                                        </Button>
                                    </Group>
                                ) : (
                                    <>
                                        <Text size="sm" style={{ flex: 1 }}>
                                            {item.description}
                                        </Text>
                                        <Group gap={4}>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                onClick={() =>
                                                    handleEditItem(
                                                        type,
                                                        index,
                                                        item.description as string,
                                                    )
                                                }
                                            >
                                                <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="red"
                                                onClick={() =>
                                                    handleDeleteItem(
                                                        type,
                                                        index,
                                                    )
                                                }
                                            >
                                                <IconTrash size={14} />
                                            </ActionIcon>
                                        </Group>
                                    </>
                                )}
                            </Group>
                        ),
                    )}
                </Stack>
            </Paper>
        );
    };

    return (
        <Stack gap="xl">
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="catagories"
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                label="Categories"
                                placeholder="Select categories"
                                data={categories.map((category) => ({
                                    value: category.id,
                                    label: category.name,
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.catagories?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                label="Skills"
                                placeholder="Select skills"
                                data={skills.map((skill) => ({
                                    value: skill.name,
                                    label: skill.name,
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.skills?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="experianceLevel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Experience Level"
                                placeholder="Select experience level"
                                data={[
                                    { value: 'ENTRY', label: 'Entry Level' },
                                    { value: 'MID', label: 'Mid Level' },
                                    { value: 'SENIOR', label: 'Senior Level' },
                                    { value: 'EXPERT', label: 'Expert Level' },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.experianceLevel?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="experiance"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Years of Experience"
                                placeholder="Enter years of experience"
                                min={0}
                                value={Number(field.value) || 0}
                                onChange={(value) =>
                                    field.onChange(Number(value))
                                }
                                error={errors.experiance?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="educationalRequirment"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Educational Requirement"
                                placeholder="Select educational requirement"
                                data={mapEnumToOptions(
                                    educationalRequirmentTypes.data,
                                )}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.educationalRequirment?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>
            </Grid>

            <Divider my="xl" />

            <Stack gap="md">
                <Title order={3}>Job Detail</Title>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 12 }}>
                        <div>
                            <TextInput
                                label="Benefits"
                                placeholder="Enter a benefit"
                                value={tempBenefits}
                                onChange={(e) =>
                                    setTempBenefits(e.target.value)
                                }
                                error={errors.jobDescriptions?.message}
                                rightSection={
                                    <Button
                                        size="xs"
                                        onClick={() => {
                                            handleAddItems(
                                                JobDescriptionType.Benefits,
                                                tempBenefits,
                                            );
                                            setTempBenefits('');
                                        }}
                                    >
                                        Add
                                    </Button>
                                }
                                rightSectionWidth={70}
                                required
                            />
                            {renderListItems(
                                JobDescriptionType.Benefits,
                                'benefits',
                            )}
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 12 }}>
                        <div>
                            <TextInput
                                label="Requirements"
                                placeholder="Enter a requirement"
                                value={tempRequirements}
                                onChange={(e) =>
                                    setTempRequirements(e.target.value)
                                }
                                error={errors.jobDescriptions?.message}
                                rightSection={
                                    <Button
                                        size="xs"
                                        onClick={() => {
                                            handleAddItems(
                                                JobDescriptionType.Requirements,
                                                tempRequirements,
                                            );
                                            setTempRequirements('');
                                        }}
                                    >
                                        Add
                                    </Button>
                                }
                                rightSectionWidth={70}
                                required
                            />
                            {renderListItems(
                                JobDescriptionType.Requirements,
                                'requirements',
                            )}
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 12 }}>
                        <div>
                            <TextInput
                                label="Responsibilities"
                                placeholder="Enter a responsibility"
                                value={tempResponsibilities}
                                onChange={(e) =>
                                    setTempResponsibilities(e.target.value)
                                }
                                error={errors.jobDescriptions?.message}
                                rightSection={
                                    <Button
                                        size="xs"
                                        onClick={() => {
                                            handleAddItems(
                                                JobDescriptionType.Responsibility,
                                                tempResponsibilities,
                                            );
                                            setTempResponsibilities('');
                                        }}
                                    >
                                        Add
                                    </Button>
                                }
                                rightSectionWidth={70}
                                required
                            />
                            {renderListItems(
                                JobDescriptionType.Responsibility,
                                'responsibilities',
                            )}
                        </div>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Stack>
    );
};
