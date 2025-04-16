import { Select } from '@mantine/core';
import type { SelectProps } from '@mantine/core';
import { useWorkplaceTypes } from 'app/_api/profile/location';
import type { EnumValue } from 'app/_api/profile/queries';

export function WorkplaceTypeSelect(props: Omit<SelectProps, 'data'>) {
    const { data: workplaceTypes } = useWorkplaceTypes();

    return (
        <Select
            {...props}
            data={
                workplaceTypes?.map((type: EnumValue) => ({
                    value: type.key,
                    label: type.value,
                })) || []
            }
        />
    );
}
