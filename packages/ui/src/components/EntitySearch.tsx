'use client';

import { CloseButton, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { entityParamSchema } from '@shega/shared';
import { IconSearch } from '@tabler/icons-react';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../utilities/cn';

type EntitySearchProps = {
    entity: string;
    placeholder?: string;
    className?: string;
};

export function EntitySearch({
    placeholder,
    entity,
    className,
}: EntitySearchProps) {
    const ref = useRef<HTMLInputElement>(null);

    // Get search params from the URL
    const [entityParams, setEntityParams] = useQueryState(
        entity,
        parseAsJson(entityParamSchema.parse),
    );

    // Local state for search input
    const [searchTerm, setSearchTerm] = useState<string>(entityParams?.s || '');

    // Debounced search term
    const [debouncedSearch] = useDebouncedValue(searchTerm, 300);

    // Store the previous search term to compare changes
    const prevSearchTerm = useRef(entityParams?.s || '');

    // Apply debounced search to URL params
    useEffect(() => {
        // Only update params if the search term actually changed
        if (debouncedSearch !== prevSearchTerm.current) {
            setEntityParams({
                ...entityParams,
                p: 1, // Only reset pagination when search term changes
                s: debouncedSearch || undefined,
            });
            prevSearchTerm.current = debouncedSearch;
        }
    }, [debouncedSearch, entityParams, setEntityParams]);

    // Sync local state with URL params when they change externally
    useEffect(() => {
        if (entityParams?.s !== searchTerm) {
            setSearchTerm(entityParams?.s || '');
        }
    }, [entityParams?.s]);

    // Auto-focus input on mount
    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <TextInput
            ref={ref}
            placeholder={placeholder || 'Search...'}
            leftSectionPointerEvents="none"
            leftSection={<IconSearch size={16} />}
            rightSection={
                <CloseButton
                    aria-label="Clear input"
                    onClick={() => setSearchTerm('')}
                    style={{ display: searchTerm ? undefined : 'none' }}
                />
            }
            rightSectionPointerEvents="all"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className={cn(className, 'w-1/3')}
        />
    );
}
