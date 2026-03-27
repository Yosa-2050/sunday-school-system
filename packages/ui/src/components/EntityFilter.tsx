'use client';

import { Select } from '@mantine/core';
import { entityParamSchema } from '@shega/shared';
import { IconFilter } from '@tabler/icons-react';
import { parseAsJson, useQueryState } from 'nuqs';
import { cn } from '../utilities/cn';
import { MultiSelectPills } from './MultiSelect';

type EntityFilterProps = {
    filterOptions: { label: string; value: string }[];
    mode: 'select' | 'multi';
    entity: string;
    field: string;
    className?: string;
    item?: string;
    placeholder?: string;
    defaultValue?: any;
    defaultOrder?: { f: string; d: 'asc' | 'desc' }[];
};

export function EntityFilter({
    mode = 'select',
    filterOptions,
    className,
    entity,
    field,
    item,
    placeholder,
    defaultValue,
    defaultOrder = [],
}: EntityFilterProps) {
    const [entityParams, setEntityParams] = useQueryState(
        entity,
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            o: defaultOrder,
        }),
    );

    const filterParam =
        entityParams?.f?.filter((f) => f.f === field)?.map((f) => f.v) || [];

    const filterOperator = entityParams?.f?.[0]?.o || 'eq';

    const handleFilterChange = (value: string | string[] | null) => {
        const existingFilters =
            entityParams?.f?.filter((f) => f.f !== field) || [];

        // Check if the value is empty string or empty array
        const isEmptyValue =
            value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            (Array.isArray(value) && value.includes(''));

        if (isEmptyValue) {
            // Only remove the current field's filter, keep other filters and default order
            const updatedParams = {
                ...entityParams,
                f: existingFilters.length > 0 ? existingFilters : undefined,
                p: 1,
                o: entityParams.o || defaultOrder,
            };
            setEntityParams(updatedParams);
        } else {
            const values = Array.isArray(value) ? value : [value];

            const newFilters = values.map((v) => ({
                f: field,
                v: v,
                o: filterOperator,
            }));

            setEntityParams({
                ...entityParams,
                f: [...existingFilters, ...newFilters]
                    .filter((filter) => filter.v && filter.v !== '') // Only include filters with non-empty, non-null values
                    .map((filter) => ({
                        ...filter,
                        v: filter.v as string,
                    })),
                p: 1,
                o: entityParams.o || defaultOrder,
            });
        }
    };

    if (mode === 'multi') {
        return (
            <MultiSelectPills
                placeholder={placeholder || 'Filter By'}
                item={item}
                value={filterParam}
                data={filterOptions}
                onChange={handleFilterChange}
            />
        );
    }

    return (
        <>
            <Select
                size="sm"
                placeholder={placeholder || 'Filter By'}
                value={filterParam[0]}
                data={filterOptions}
                onChange={handleFilterChange}
                className={cn(className)}
                leftSection={<IconFilter size={18} stroke="1.25" />}
            />
        </>
    );
}
