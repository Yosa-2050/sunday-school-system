'use client';

import { Select } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { parseAsJson, useQueryState } from 'nuqs';
import { entityParamSchema } from '@shega/shared';
import { cn } from '../utilities/cn';
import { MultiSelectPills } from './MultiSelect';

type EntityFilterProps = {
    filterOptions: { label: string; value: string }[];
    mode: 'select' | 'multi';
    entity: string;
    field: string;
    className?: string;
    item?: string;
};

export function EntityFilter({
    mode = 'select',
    filterOptions,
    className,
    entity,
    field,
    item,
}: EntityFilterProps) {
    const [entityParams, setEntityParams] = useQueryState(
        entity,
        parseAsJson(entityParamSchema.parse),
    );

    const defaultOption = filterOptions[0];

    if (!defaultOption) {
        throw new Error('filterOptions must not be empty');
    }

    // For multi-select, ensure the value is always an array
    const filterParam = entityParams?.f
        ?.filter((f) => f.f === field)
        ?.map((f) => f.v) || [defaultOption.value];

    const filterOperator = entityParams?.f?.[0]?.o || 'eq';

    const handleFilterChange = (value: string | string[] | null) => {
        const existingFilters =
            entityParams?.f?.filter((f) => f.f !== field) || [];

        if (!value || (Array.isArray(value) && value.length === 0)) {
            const updatedParams = { ...entityParams };
            updatedParams.f =
                existingFilters.length > 0 ? existingFilters : undefined;

            setEntityParams({ ...updatedParams, p: 1 });
        } else {
            const values = Array.isArray(value) ? value : [value];

            const newFilters = values.map((v) => ({
                f: field,
                v: v,
                o: filterOperator,
            }));

            setEntityParams({
                ...entityParams,
                f: [...existingFilters, ...newFilters],
            });
        }
    };

    if (mode === 'multi') {
        return (
            <MultiSelectPills
                placeholder="Filter By"
                item={item}
                value={filterParam} // Pass the array of values
                data={filterOptions}
                onChange={handleFilterChange}
                // className={cn(className)}
                // leftSection={<IconFilter size={18} stroke="1.25" />}
            />
        );
    }

    return (
        <>
            <Select
                size="sm"
                placeholder="Filter By"
                value={filterParam[0]} // Pass the first value for single select
                data={filterOptions}
                onChange={handleFilterChange}
                className={cn(className)}
                leftSection={<IconFilter size={18} stroke="1.25" />}
            />
        </>
    );
}
