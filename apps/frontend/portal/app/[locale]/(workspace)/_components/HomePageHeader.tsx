import { useRouter } from '@/i18n/routing';
import { Button, Container, Group, Paper, Stack, TextInput, Title, Text } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import type React from 'react';
import type { JobFilters } from '../page';

type HomePageHeaderProps = {
    filters: JobFilters
    updateFilters: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const HomePageHeader = ({ filters, updateFilters }: HomePageHeaderProps) => {
            const router = useRouter();
        
        
        const handleSearch = useDebouncedCallback((term: string | null) => {
            if (term) {
                router.push(`/jobs?search=${encodeURIComponent(term)}`);
            } else {
                router.push('/jobs');
            }
        }, 300);
    
        
  return (

            <div className="relative">
                <div
                    className="py-12 md:py-24 bg-cover bg-center relative h-[70vh]"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                    <Container size="xl" className="relative z-10">
                        <Stack gap="lg" className="max-w-xl mt-20">
                            <Title className="text-4xl md:text-6xl font-bold text-white">
                                Find The Job That Fits Your Life
                            </Title>
                            <Text size="lg" c="gray.2">
                                Shega Jobs makes finding your ideal career
                                simple and fast. Browse diverse job listings and
                                kickstart your professional journey today.
                            </Text>
                        </Stack>

                        <Stack
                            gap="sm"
                            mt="lg"
                            className="max-w-5xl md:hidden"
                            hiddenFrom="md"
                        >
                            <Paper withBorder p="sm" radius="lg" shadow="sm">
                                <Group gap="sm" className='roundedx'>
                                    <TextInput
                                        name="keyword"
                                        size="lg"
                                        placeholder="Job title, keywords or organization"
                                        value={filters.keyword}
                                        onChange={updateFilters}
                                        leftSection={<IconSearch size={24} />}
                                        className="flex-1"
                                        variant="unstyled"
                                    />
                                    <Button
                                        size="lg"
                                        radius="lg"
                                        onClick={() =>
                                            handleSearch(filters.keyword)
                                        }
                                    >
                                        Find Jobs
                                    </Button>
                                </Group>
                            </Paper>
                        </Stack>

                        <Paper
                            withBorder
                            className="max-w-5xl hidden md:flex shadow-lg"
                            mt="lg"
                            visibleFrom="md"
                        >
                            <Group
                                gap="sm"
                                className="max-w-5xl p-2 shadow-lg border-none flex "
                                wrap="nowrap"
                            >
                                <TextInput
                                    name="keyword"
                                    size="lg"
                                    placeholder="Job title, keywords or organization"
                                    value={filters.keyword}
                                    onChange={updateFilters}
                                    leftSection={<IconSearch size={24} />}
                                    className="flex-1 p-2"
                                    styles={{
                                        input: {
                                            border: 'none',
                                        },
                                    }}
                                />
                                <Button
                                    size="lg"
                                    className="border-none"
                                    onClick={() =>
                                        handleSearch(filters.keyword)
                                    }
                                >
                                    Find Jobs
                                </Button>
                            </Group>
                        </Paper>
                    </Container>
                </div>
            </div>
  )
}

export  { HomePageHeader }