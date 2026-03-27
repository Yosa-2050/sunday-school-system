'use client';

import { Flex, Text } from '@mantine/core';
import { entityParamSchema } from '@shega/shared';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { parseAsJson, useQueryState } from 'nuqs';
import { cn } from '../utilities/cn';

type EntityColumnProps = {
    entity: string;
    field: string;
    label: string;
    className?: string;
};

export function EntityColumn({
    entity,
    field,
    label,
    className,
}: EntityColumnProps) {
    const [entityParams, setEntityParams] = useQueryState(
        entity,
        parseAsJson(entityParamSchema.parse),
    );

    const currentSort = entityParams?.o?.find(
        (sortItem) => sortItem.f === field,
    );
    const currentSortDirection = currentSort?.d;

    const handleSortChange = () => {
        const newSortDirection =
            currentSortDirection === 'asc' ? 'desc' : 'asc';

        const updatedSorts =
            entityParams?.o?.filter((sortItem) => sortItem.f !== field) || [];
        updatedSorts.push({ f: field, d: newSortDirection });

        setEntityParams({
            ...entityParams,
            o: updatedSorts,
            p: 1,
        });
    };

    return (
        <Flex
            align="center"
            justify="space-between"
            className={cn('cursor-pointer', className)}
            onClick={handleSortChange}
        >
            <Text fw="bold" size="sm">
                {label}
            </Text>
            {currentSortDirection === 'asc' ? (
                <IconSortAscending
                    size={18}
                    className="text-primary bg-primary-2"
                />
            ) : currentSortDirection === 'desc' ? (
                <IconSortDescending
                    size={18}
                    className="text-primary bg-primary-2"
                />
            ) : (
                // Default icon when no sort is applied
                <IconSortAscending size={18} className="text-gray-400" />
            )}
        </Flex>
    );
}
