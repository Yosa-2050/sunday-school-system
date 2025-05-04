import {
    Box,
    Button,
    Card,
    Checkbox,
    Group,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { PER_PAGE } from '@shega/shared';
import { IconFilter, IconMapPin, IconSearch, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { type Filter, fetchJobs } from 'app/_api/jobs/fetch-jobs';
import { fetchCities, fetchCountries } from 'app/_api/location/fetch-countries';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

interface ExperienceLevel {
    value: string;
    label: string;
}

const JOB_TYPES = [
    { value: 'FULL_TIME', label: 'Full-time' },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior Level' },
];

const calculateActiveFilters = (filters: Filter) => {
    const baseFilters = Object.entries(filters).filter(([key, value]) => {
        if (
            key === 'salaryFrom' ||
            key === 'salaryTo' ||
            key === 'pagination'
        ) {
            return false;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== '' && value !== undefined;
    }).length;

    const hasSalaryFilter =
        (filters.salaryFrom || 0) !== 0 || (filters.salaryTo || 0) !== 100000;
    return baseFilters + (hasSalaryFilter ? 1 : 0);
};

interface FilterSidebarProps {
    filters: Filter;
    setFilters: (filters: Filter) => void;
    handleJobTypeChange: (value: string) => void;
    handleExperienceLevelChange: (value: string) => void;
    handleSearch: (term: string | null) => void;
    handleApplyFilters: () => void;
}

export const FilterSidebar = ({
    filters,
    setFilters,
    handleJobTypeChange,
    handleExperienceLevelChange,
    handleApplyFilters,
}: FilterSidebarProps) => {
    const searchParam = useSearchParams();
    const t = useTranslations('jobListing');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => fetchCountries(),
    });

    const countryCode = countries?.find(
        (country) => country.id === filters.countryId,
    )?.code;

    const { data: cities } = useQuery({
        queryKey: ['cities', countryCode],
        queryFn: () => fetchCities(countryCode || ''),
        enabled: !!countryCode,
    });

    return (
        <Box className="sticky top-24" hidden={isMobile}>
            <Card p="lg" withBorder={false} w={300}>
                <Box
                    h={isMobile ? '70vh' : 700}
                    aria-orientation="vertical"
                    className="overflow-x-hidden"
                >
                    <Stack gap="md">
                        <Box>
                            <Text size="sm" fw={500} mb="xs">
                                {t('keyword')}
                            </Text>
                            <TextInput
                                value={filters.title ?? ''}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Search jobs..."
                                leftSection={<IconSearch size={16} />}
                                radius="md"
                            />
                        </Box>

                        <Box>
                            <Text size="sm" fw={500} mb="xs">
                                {t('country')}
                            </Text>
                            <Select
                                key={`country-${filters.countryId}`}
                                value={filters.countryId || null}
                                onChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        countryId: value || '',
                                        cityId: '',
                                    })
                                }
                                placeholder="Select Country"
                                data={
                                    countries?.map((country) => ({
                                        value: country.id,
                                        label: country.name,
                                    })) || []
                                }
                                leftSection={<IconMapPin size={16} />}
                                radius="md"
                                searchable
                                clearable
                            />
                        </Box>
                        <Box>
                            <Text size="sm" fw={500} mb="xs">
                                {t('city')}
                            </Text>
                            <Select
                                key={`city-${filters.cityId}`}
                                value={filters.cityId || null}
                                onChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        cityId: value || '',
                                    })
                                }
                                placeholder="Select City"
                                data={
                                    cities?.map((city) => ({
                                        value: city.id,
                                        label: city.name,
                                    })) || []
                                }
                                leftSection={<IconMapPin size={16} />}
                                radius="md"
                                searchable
                                clearable
                                disabled={!countryCode}
                            />
                        </Box>

                        <Box>
                            <Text size="sm" fw={500} mb="xs">
                                {t('jobType')}
                            </Text>
                            <Stack gap="xs">
                                {JOB_TYPES.map((type) => (
                                    <Checkbox
                                        key={type.value}
                                        label={type.label}
                                        checked={filters.type === type.value}
                                        onChange={() =>
                                            handleJobTypeChange(
                                                filters.type === type.value
                                                    ? ''
                                                    : type.value,
                                            )
                                        }
                                        radius="md"
                                    />
                                ))}
                            </Stack>
                        </Box>

                        <Box>
                            <Text size="sm" fw={500} mb="xs">
                                {t('experienceLevel')}
                            </Text>
                            <Stack gap="xs">
                                {EXPERIENCE_LEVELS.map((level) => (
                                    <Checkbox
                                        key={level.value}
                                        label={level.label}
                                        checked={
                                            filters.experianceLevel ===
                                            level.value
                                        }
                                        onChange={() =>
                                            handleExperienceLevelChange(
                                                filters.experianceLevel ===
                                                    level.value
                                                    ? ''
                                                    : level.value,
                                            )
                                        }
                                        radius="md"
                                    />
                                ))}
                            </Stack>
                        </Box>

                        <Box>
                            <Group justify="space-between" mb="xs">
                                <Text size="sm" fw={500}>
                                    {t('salaryRange')}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {(filters.salaryFrom ?? 0).toLocaleString()}{' '}
                                    - {(filters.salaryTo ?? 0).toLocaleString()}{' '}
                                    ETB
                                </Text>
                            </Group>
                            <Group grow>
                                <NumberInput
                                    hideControls
                                    size="xs"
                                    placeholder="Min"
                                    label="Min"
                                    value={filters.salaryFrom || ''}
                                    aria-placeholder="Min"
                                    onChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            salaryFrom: value
                                                ? Number(value)
                                                : undefined,
                                        })
                                    }
                                    radius="md"
                                />
                                <NumberInput
                                    hideControls
                                    size="xs"
                                    placeholder="Max"
                                    label="Max"
                                    value={filters.salaryTo || ''}
                                    aria-placeholder="Max"
                                    onChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            salaryTo: value
                                                ? Number(value)
                                                : undefined,
                                        })
                                    }
                                    radius="md"
                                />
                            </Group>
                        </Box>
                    </Stack>
                </Box>

                <Group grow>
                    <Button
                        variant="outline"
                        fullWidth
                        mt="md"
                        onClick={() => {
                            const resetFilters = {
                                pagination: {
                                    page: 1,
                                    limit: PER_PAGE,
                                },
                                title: '',
                                categoryId: '',
                                organizationId: '',
                                countryId: '',
                                cityId: '',
                                type: '',
                                experianceLevel: '',
                                salaryFrom: undefined,
                                salaryTo: undefined,
                            };

                            setFilters(resetFilters);
                            // Pass the reset filters directly to the API call
                            // instead of relying on the state update
                            fetchJobs(resetFilters).then(() => {
                                handleApplyFilters();
                            });
                        }}
                        radius="md"
                        leftSection={<IconX size={16} />}
                    >
                        {t('resetFilters')}
                    </Button>
                    <Button
                        variant="filled"
                        fullWidth
                        mt="md"
                        onClick={handleApplyFilters}
                        radius="md"
                        leftSection={<IconFilter size={16} />}
                    >
                        {t('applyFilters')}
                    </Button>
                </Group>
            </Card>
        </Box>
    );
};
