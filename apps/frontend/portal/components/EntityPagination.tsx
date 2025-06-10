'use client';

import { Box, Pagination } from '@mantine/core';
import { PER_PAGE } from '@shega/shared';
import { cn } from 'utility/cn';

type EntityPaginationProps = {
    total: number;
    perPage?: number;
    hideCounter?: boolean;
    customParam?: string;
    createPageURL?: (page: number) => void;
    p?: number;
};

export function EntityPagination({
    p,
    total,
    perPage = PER_PAGE,
    hideCounter = false,
    createPageURL
}: EntityPaginationProps) {
    const currentPage = p || 1;
    

    const totalPages = Math.ceil(total / perPage);
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <Box
            className={cn(
                'flex items-center mt-6',
                hideCounter ? 'justify-center' : 'justify-between',
            )}
        >
            <Box className="px-2">
                {from} to {to} of {total} results
            </Box>
            {total >= perPage ? (
                <Pagination
                    size="sm"
                    total={totalPages}
                    value={currentPage}
                    onChange={createPageURL}
                />
            ) : null}
        </Box>
    );
}
