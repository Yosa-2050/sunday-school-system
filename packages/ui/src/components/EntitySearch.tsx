'use client';

import { CloseButton, TextInput } from '@mantine/core';
import { entityParamSchema } from '@shega/shared';
import { IconSearch } from '@tabler/icons-react';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks'; // Import useDebouncedValue
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
    const [debouncedSearch] = useDebouncedValue(searchTerm, 3000);

    // Apply debounced search to URL params
    useEffect(() => {
        if (debouncedSearch !== entityParams?.s) {
            setEntityParams({
                ...entityParams,
                p: 1,
                s: debouncedSearch || undefined,
            });
        }
    }, [debouncedSearch]);

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
                    onClick={() => setSearchTerm('')} // Reset input field properly
                    style={{ display: searchTerm ? undefined : 'none' }}
                />
            }
            rightSectionPointerEvents="all"
            onChange={(e) => setSearchTerm(e.target.value)} // Controlled input state
            value={searchTerm} // Ensure input reflects state
            className={cn(className, 'w-1/3')}
        />
    );
}
