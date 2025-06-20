'use client';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { useQuery } from '@tanstack/react-query';
import { applicantDetails } from 'app/[locale]/_api/job-seeker';
import { useParams } from 'next/navigation';

const Page = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useQuery({
        queryKey: ['applicants', id],
        queryFn: () => applicantDetails(id),
    });
    if (isLoading) {
        return <EntityPageLoading />;
    }
    return <div>Page {JSON.stringify(data)}</div>;
};

export default Page;
