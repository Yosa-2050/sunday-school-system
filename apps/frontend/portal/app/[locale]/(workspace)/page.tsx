'use client';

import { Footer } from '@/components/Footer';
import { redirect } from '@/i18n/routing';
import {
    Container,
    Divider, Paper, Title
} from '@mantine/core';
import { useAuth } from '@shega/ui';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { JobList } from './_components/JobsList';
import { HomePageHeader } from './_components/HomePageHeader';

export interface JobFilters {
    location: string;
    jobType: string;
    salaryRange: string;
    experienceLevel: string;
    keyword: string;
}

export default function HomePage() {
    const { user } = useAuth();
    const locale = useLocale();   

    const [filters, setFilters] = useState<JobFilters>({
        location: '',
        jobType: '',
        salaryRange: '',
        experienceLevel: '',
        keyword: '',
    });

    const updateFilters = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name: field, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    }

    useEffect(() => {
        if (!user) {
            redirect({ href: '/auth/login', locale });
        }
    }, [user, locale]);

    return (
        <>
            <HomePageHeader updateFilters={updateFilters} filters={filters}/>
            <Paper p="md" withBorder={false} className="border-none mt-4">
                <Container size="xl">
                    <Title className="text-2xl font-bold my-4" c="dimmed">
                        Recent Jobs
                    </Title>
                    <Divider mb={'md'} />
                    <JobList filters={filters} />
                </Container>
            </Paper>
            <Footer />
        </>
    );
}

