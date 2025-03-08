'use client';

import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Group,
    LoadingOverlay,
    Menu,
    NumberFormatter,
    Paper,
    SimpleGrid,
    Text,
    TextInput,
    Title,
    TypographyStylesProvider,
} from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { COOKIE_ACCESS_TOKEN, logger } from '@shega/shared';
import { useAuth } from '@shega/ui';
import {
    IconBell,
    IconBookmark,
    IconBookmarkFilled,
    IconBriefcase,
    IconBuildingSkyscraper,
    IconBulb,
    IconChartBar,
    IconClock,
    IconCode,
    IconCurrencyDollar,
    IconDeviceMobile,
    IconHeart,
    IconHeartFilled,
    IconLogout,
    IconMapPin,
    IconPencil,
    IconSearch,
    IconSettings,
    IconTruck,
    IconUser,
    IconUsers,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from 'app/_api/jobs/fetch-jobs';
import { jobTypes } from 'constants/job-type';
import { deleteCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

// Types for our filters
interface JobFilters {
    location: string;
    jobType: string;
    salaryRange: string;
    experienceLevel: string;
    keyword: string;
}

interface Job {
    id: number;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    jobType: string;
    salaryRange: string;
    experienceLevel: string;
    description: string;
    postedDate: string;
    skills: string[];
    isBookmarked?: boolean;
    isFavorite?: boolean;
}

interface Category {
    title: string;
    icon: React.ReactNode;
    jobCount: number;
    color: string;
}

// App Header Component
function AppHeader() {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const isAuthenticated = !!user;
    const t = useTranslations('jobPortal');

    const openModal = () =>
        modals.openConfirmModal({
            title: 'Are you sure you want to logout?',
            children: (
                <Text size="sm">
                    You will be logged out of your account. Any unsaved changes
                    will be lost
                </Text>
            ),
            labels: { cancel: 'Cancel', confirm: 'Logout' },
            centered: true,
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                deleteCookie(COOKIE_ACCESS_TOKEN);
                deleteCookie('role');
                setUser(undefined);
                router.push('/');
            },
        });

    return (
        <Box className="border-b border-gray-200">
            <Container size="xl">
                <Group h={80} justify="space-between">
                    <Group>
                        <Text size="xl" fw={700} className="text-[#14a800]">
                            Shega Jobs
                        </Text>
                        {isAuthenticated && (
                            <Group ml={48} gap="xl">
                                <Text className="font-medium hover:text-[#14a800] cursor-pointer">
                                    Find Work
                                </Text>
                                <Text className="font-medium hover:text-[#14a800] cursor-pointer">
                                    My Jobs
                                </Text>
                                <Text className="font-medium hover:text-[#14a800] cursor-pointer">
                                    Reports
                                </Text>
                                <Text className="font-medium hover:text-[#14a800] cursor-pointer">
                                    Messages
                                </Text>
                            </Group>
                        )}
                    </Group>

                    <Group>
                        {isAuthenticated ? (
                            <Group>
                                <ActionIcon variant="subtle" size="lg">
                                    <IconBell size={20} />
                                </ActionIcon>
                                <Menu shadow="md" width={280}>
                                    <Menu.Target>
                                        <Group
                                            gap="xs"
                                            className="cursor-pointer"
                                        >
                                            <Avatar
                                                size="md"
                                                radius="xl"
                                                color="green"
                                            >
                                                {user.firstName?.[0]}
                                                {user.lastName?.[0]}
                                            </Avatar>
                                            <div>
                                                <Text size="sm" fw={500}>
                                                    {user.firstName}{' '}
                                                    {user.lastName}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {user.phoneNumber}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={<IconUser size={14} />}
                                            onClick={() =>
                                                router.push('/profile')
                                            }
                                        >
                                            {t('profile')}
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={
                                                <IconSettings size={14} />
                                            }
                                            onClick={() =>
                                                router.push('/settings')
                                            }
                                        >
                                            {t('settings')}
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item
                                            leftSection={
                                                <IconLogout size={14} />
                                            }
                                            color="red"
                                            onClick={openModal}
                                        >
                                            {t('logout')}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        ) : (
                            <Group>
                                <Button
                                    variant="subtle"
                                    onClick={() => router.push('/auth/login')}
                                >
                                    {t('login')}
                                </Button>
                                {/* <Button
                  className="bg-[#14a800] hover:bg-[#14a800]/90"
                  onClick={() => router.push("/auth/signup")}
                >
                  {t("signup")}
                </Button> */}
                            </Group>
                        )}
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}

const jobCategories: Category[] = [
    {
        title: 'Technology',
        icon: <IconCode size={24} />,
        jobCount: 1234,
        color: 'blue',
    },
    {
        title: 'Design',
        icon: <IconPencil size={24} />,
        jobCount: 856,
        color: 'pink',
    },
    {
        title: 'Business',
        icon: <IconChartBar size={24} />,
        jobCount: 943,
        color: 'green',
    },
    {
        title: 'Real Estate',
        icon: <IconBuildingSkyscraper size={24} />,
        jobCount: 432,
        color: 'orange',
    },
    {
        title: 'Mobile Dev',
        icon: <IconDeviceMobile size={24} />,
        jobCount: 654,
        color: 'violet',
    },
    {
        title: 'Innovation',
        icon: <IconBulb size={24} />,
        jobCount: 345,
        color: 'yellow',
    },
    {
        title: 'HR',
        icon: <IconUsers size={24} />,
        jobCount: 567,
        color: 'red',
    },
    {
        title: 'Logistics',
        icon: <IconTruck size={24} />,
        jobCount: 234,
        color: 'cyan',
    },
];

// Can component for auth checks
interface CanProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    action: () => void;
}

function Can({ children, fallback, action }: CanProps) {
    const router = useRouter();
    const { user } = useAuth();
    const isAuthenticated = !!user;

    const handleAction = () => {
        if (isAuthenticated) {
            action();
        } else {
            router.push('/auth/login');
        }
    };

    return (
        <div
            onClick={handleAction}
            onKeyUp={(e) => e.key === 'Enter' && handleAction()}
            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
            onKeyPress={(e) => e.key === 'Enter' && handleAction()}
            style={{ cursor: 'pointer' }}
        >
            {isAuthenticated ? children : fallback || children}
        </div>
    );
}

// Category Card Component
function CategoryCard({ category }: { category: Category }) {
    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className="hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
            <Group>
                <Avatar
                    size="lg"
                    radius="md"
                    color={category.color}
                    className="bg-opacity-20"
                >
                    {category.icon}
                </Avatar>
                <div>
                    <Text size="lg" fw={600}>
                        {category.title}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {category.jobCount} jobs available
                    </Text>
                </div>
            </Group>
        </Card>
    );
}

// Filter Sidebar Component
function JobFilterSidebar({
    filters,
    onFilterChange,
}: {
    filters: JobFilters;
    onFilterChange: (filters: JobFilters) => void;
}) {
    const t = useTranslations('jobListing');

    return (
        <Paper className="p-6 rounded-lg sticky top-4" shadow="sm">
            <Title order={4} className="mb-6 font-semibold">
                {t('filterLabel')}
            </Title>
            <div className="space-y-6">
                <TextInput
                    label={t('location')}
                    value={filters.location}
                    onChange={(e) =>
                        onFilterChange({ ...filters, location: e.target.value })
                    }
                    placeholder="Enter location"
                    leftSection={<IconMapPin size={16} />}
                />
                <TextInput
                    label={t('jobType')}
                    value={filters.jobType}
                    onChange={(e) =>
                        onFilterChange({ ...filters, jobType: e.target.value })
                    }
                    placeholder="Job type"
                    leftSection={<IconBriefcase size={16} />}
                />
                <TextInput
                    label={t('salaryRange')}
                    value={filters.salaryRange}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            salaryRange: e.target.value,
                        })
                    }
                    placeholder="Salary range"
                    leftSection={<IconCurrencyDollar size={16} />}
                />
                <TextInput
                    label={t('experience')}
                    value={filters.experienceLevel}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            experienceLevel: e.target.value,
                        })
                    }
                    placeholder="Experience level"
                    leftSection={<IconClock size={16} />}
                />
                <Button
                    variant="light"
                    fullWidth
                    onClick={() =>
                        onFilterChange({
                            location: '',
                            jobType: '',
                            salaryRange: '',
                            experienceLevel: '',
                            keyword: '',
                        })
                    }
                >
                    {t('resetFilters')}
                </Button>
            </div>
        </Paper>
    );
}

// Job List Component
function JobList({ filters }: { filters: JobFilters }) {
    const router = useRouter();
    const t = useTranslations('jobListing');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [selection, setSelection] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useQueryState('search', {
        defaultValue: '',
    });
    const [categoryFilter, setCategoryFilter] = useQueryState('category', {
        defaultValue: '',
    });
    const [sortOrder, setSortOrder] = useQueryState('sort', {
        defaultValue: 'asc',
    });
    const [page, setPage] = useQueryState('page', { defaultValue: '1' });
    const [limit, setLimit] = useQueryState('limit', { defaultValue: '10' });

    const [debouncedSearch] = useDebouncedValue(searchQuery, 500);

    const { data, isLoading, error } = useQuery({
        queryKey: ['jobs', debouncedSearch, page, limit, categoryFilter],
        queryFn: () =>
            fetchJobs({
                search: debouncedSearch,
                page: +page,
                limit: +limit,
            }),
    });

    const jobs = data?.data || [];
    const totalPages = data?.totalPages || 0;

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    const toggleBookmark = (jobId: string) => {
        logger.log(jobId);
    };

    const toggleFavorite = (jobId: string) => {
        logger.log(jobId);
    };

    return (
        <div className="space-y-4">
            {data?.data.map((job) => (
                <Card
                    key={job.id}
                    className="hover:shadow-md transition-shadow duration-200"
                    padding="lg"
                >
                    <Group justify="space-between" align="flex-start">
                        <Group>
                            <Avatar size="lg" color="blue">
                                {job.organization.name.slice(0, 2)}
                            </Avatar>
                            <div>
                                <Title order={4} className="font-semibold">
                                    {job.title}
                                </Title>
                                <Text size="sm" c="dimmed">
                                    {job.organization?.name}
                                </Text>
                            </div>
                        </Group>
                        <Group>
                            <Can
                                action={() => toggleBookmark(job.id)}
                                fallback={
                                    <ActionIcon variant="subtle">
                                        <IconBookmark size={20} />
                                    </ActionIcon>
                                }
                            >
                                <ActionIcon variant="subtle">
                                    {/* biome-ignore lint/correctness/noConstantCondition: <explanation> */}
                                    {false ? (
                                        <IconBookmarkFilled
                                            size={20}
                                            color="#228be6"
                                        />
                                    ) : (
                                        <IconBookmark size={20} />
                                    )}
                                </ActionIcon>
                            </Can>
                            <Can
                                action={() => toggleFavorite(job.id)}
                                fallback={
                                    <ActionIcon variant="subtle">
                                        <IconHeart size={20} />
                                    </ActionIcon>
                                }
                            >
                                <ActionIcon variant="subtle">
                                    {/* biome-ignore lint/correctness/noConstantCondition: <explanation> */}
                                    {false ? (
                                        <IconHeartFilled
                                            size={20}
                                            color="#ff6b6b"
                                        />
                                    ) : (
                                        <IconHeart size={20} />
                                    )}
                                </ActionIcon>
                            </Can>
                            <Text size="sm" c="dimmed">
                                {new Date().toDateString()}
                            </Text>
                        </Group>
                    </Group>

                    <TypographyStylesProvider mt={'md'}>
                        <div
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                            dangerouslySetInnerHTML={{
                                __html: job.description,
                            }}
                            className="line-clamp-2"
                        />
                    </TypographyStylesProvider>

                    {/* <Group className="mt-4" gap="xs">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="light">
                {skill}
              </Badge>
            ))}
          </Group> */}

                    <Divider className="my-4" />

                    <Group justify="space-between" align="center">
                        <Group gap="lg">
                            <Group gap="xs">
                                <IconMapPin size={16} />
                                <Text size="sm">{'job.location'}</Text>
                            </Group>
                            <Group gap="xs">
                                <IconBriefcase size={16} />
                                <Text size="sm">{jobTypes[job.type]}</Text>
                            </Group>
                            <Group gap="xs">
                                <IconCurrencyDollar size={16} />
                                <Text size="sm">
                                    <NumberFormatter
                                        value={job.salaryFrom}
                                        thousandSeparator=","
                                    />{' '}
                                    to{' '}
                                    <NumberFormatter
                                        value={job.salaryTo}
                                        thousandSeparator=","
                                    />{' '}
                                </Text>
                            </Group>
                        </Group>
                        <Can
                            action={() => logger.log('lasdfjk')}
                            fallback={<Button>Sign in to Apply</Button>}
                        >
                            <Button>Apply Now</Button>
                        </Can>
                    </Group>
                </Card>
            ))}
        </div>
    );
}

export default function HomePage() {
    const t = useTranslations('jobListing');
    const [filters, setFilters] = useState<JobFilters>({
        location: '',
        jobType: '',
        salaryRange: '',
        experienceLevel: '',
        keyword: '',
    });

    return (
        <>
            <AppHeader />

            {/* Hero Section */}
            <div
                className="py-20 mb-12 bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <Container size="xl" className="relative">
                    <div className="text-center mb-12">
                        <Title className="text-5xl font-bold mb-4 text-white">
                            Find Your Dream Job Today
                        </Title>
                        <Text size="xl" className="text-gray-200">
                            Discover thousands of job opportunities with all the
                            information you need
                        </Text>
                    </div>

                    <TextInput
                        size="xl"
                        placeholder={t('searchPlaceholder')}
                        value={filters.keyword}
                        onChange={(e) =>
                            setFilters({ ...filters, keyword: e.target.value })
                        }
                        leftSection={<IconSearch size={24} />}
                        className="max-w-3xl mx-auto bg-white rounded-xl"
                    />
                </Container>
            </div>

            {/* Categories Section */}
            <Container size="xl" className="mb-20">
                <Title className="text-3xl font-bold mb-8 text-center">
                    Browse by Category
                </Title>
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing="lg"
                >
                    {jobCategories.map((category) => (
                        <CategoryCard
                            key={category.title}
                            category={category}
                        />
                    ))}
                </SimpleGrid>
            </Container>

            <Container size="xl">
                <Grid>
                    {/* Filters Sidebar */}
                    <Grid.Col span={3}>
                        <JobFilterSidebar
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                    </Grid.Col>

                    {/* Job Listings */}
                    <Grid.Col span={9}>
                        <JobList filters={filters} />
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}
