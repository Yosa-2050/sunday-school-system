'use client';

import {
    Badge,
    Button,
    Grid,
    Group,
    MultiSelect,
    NumberInput,
    Paper,
    Select,
    Stack,
} from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchEnum } from 'app/[locale]/_api/enum';
import { fetchCategories, fetchSkills } from 'app/[locale]/_api/job-details';
import { mapEnumToOptions } from '../../jobs/create/components/utils';
import type { Filters } from './Aplicants';

interface Props {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: () => void;
}

export const ApplicantsFilters = ({
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    refetch,
}: Props) => {
    const { data: skills = [] } = useQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills,
    });
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });
    const { data: educationalRequirmentType = { data: {} } } = useQuery({
        queryKey: ['educationalRequirmentType'],
        queryFn: () => fetchEnum('EducationalRequirementType'),
    });

    const hasActiveFilters = () =>
        Object.values(filters).filter((v) =>
            typeof v === 'object'
                ? // biome-ignore lint/nursery/noNestedTernary: <explanation>
                  v && ('min' in v || 'max' in v)
                    ? v.min !== '' || v.max !== ''
                    : Array.isArray(v) && v.length > 0
                : v !== '',
        ).length;

    const clearFilters = () => {
        setFilters({
            status: '',
            experience: { min: '', max: '' },
            category: [],
            gender: null,
            ageTo: '',
            ageFrom: '',
            skills: [],
            educationalRequirment: [],
        });
        refetch();
    };

    return (
        <Paper withBorder radius="md" p="md">
            <Group justify="space-between" mb={showFilters ? 'md' : 0}>
                <Group>
                    <Button
                        variant="light"
                        leftSection={<IconFilter size={16} />}
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        Filters
                    </Button>
                    {hasActiveFilters() && (
                        <Badge variant="filled" color="blue">
                            {
                                Object.values(filters).filter((v) =>
                                    typeof v === 'object'
                                        ? // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                          v && ('min' in v || 'max' in v)
                                            ? v.min !== '' || v.max !== ''
                                            : Array.isArray(v) && v.length > 0
                                        : v !== '',
                                ).length
                            }{' '}
                            active
                        </Badge>
                    )}
                </Group>
            </Group>

            {showFilters && (
                <Stack gap="md">
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Gender"
                                placeholder="Select gender"
                                value={filters.gender}
                                onChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        gender: value,
                                    }))
                                }
                                data={[
                                    { value: 'MALE', label: 'Male' },
                                    { value: 'FEMALE', label: 'Female' },
                                ]}
                                clearable
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <MultiSelect
                                label="Skills"
                                placeholder="Select skills"
                                value={filters.skills}
                                onChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        skills: value,
                                    }))
                                }
                                data={skills.map((c) => ({
                                    value: c.name,
                                    label: c.name,
                                }))}
                                clearable
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <MultiSelect
                                label="Categories"
                                placeholder="Select categories"
                                value={filters.category}
                                onChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        category: value,
                                    }))
                                }
                                data={categories.map((c) => ({
                                    value: c.id,
                                    label: c.name,
                                }))}
                                clearable
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <MultiSelect
                                label="Educational Requirements"
                                placeholder="Select educational requirements"
                                value={filters.educationalRequirment}
                                onChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        educationalRequirment: value,
                                    }))
                                }
                                data={mapEnumToOptions(
                                    educationalRequirmentType.data,
                                )}
                                clearable
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Group grow>
                                <NumberInput
                                    label="Experience Min (years)"
                                    placeholder="Min"
                                    value={filters.experience.min}
                                    onChange={(val) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            experience: {
                                                ...prev.experience,
                                                min:
                                                    typeof val === 'number' &&
                                                    !Number.isNaN(val)
                                                        ? val
                                                        : '',
                                            },
                                        }))
                                    }
                                    min={0}
                                    max={50}
                                />
                                <NumberInput
                                    label="Experience Max (years)"
                                    placeholder="Max"
                                    value={filters.experience.max}
                                    onChange={(val) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            experience: {
                                                ...prev.experience,
                                                max:
                                                    typeof val === 'number' &&
                                                    !Number.isNaN(val)
                                                        ? val
                                                        : '',
                                            },
                                        }))
                                    }
                                    min={0}
                                    max={50}
                                />
                            </Group>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <NumberInput
                                label="Age From"
                                placeholder="Minimum age"
                                value={filters.ageFrom}
                                onChange={(val) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        ageFrom:
                                            typeof val === 'number' &&
                                            !Number.isNaN(val)
                                                ? val
                                                : '',
                                    }))
                                }
                                min={18}
                                max={100}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <NumberInput
                                label="Age To"
                                placeholder="Maximum age"
                                value={filters.ageTo}
                                onChange={(val) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        ageTo:
                                            typeof val === 'number' &&
                                            !Number.isNaN(val)
                                                ? val
                                                : '',
                                    }))
                                }
                                min={18}
                                max={100}
                            />
                        </Grid.Col>
                    </Grid>

                    {hasActiveFilters() ? (
                        <Group>
                            <Button
                                size="sm"
                                leftSection={<IconFilter size={14} />}
                                onClick={refetch}
                            >
                                Apply
                            </Button>
                            <Button
                                variant="light"
                                color="red"
                                size="sm"
                                leftSection={<IconX size={14} />}
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                        </Group>
                    ) : null}
                </Stack>
            )}
        </Paper>
    );
};
