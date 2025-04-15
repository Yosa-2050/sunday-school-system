import { Select } from '@mantine/core';
import type { SelectProps } from '@mantine/core';
import { useRegions } from 'app/_api/profile/location';
import { useCountries } from 'app/_api/profile/location';
import { useEffect, useState } from 'react';

export function RegionSelect(props: Omit<SelectProps, 'data'>) {
    const { data: countries } = useCountries();
    const [countryCode, setCountryCode] = useState<string>('');
    const { data: regions } = useRegions(countryCode);

    // Find the country code when the country ID changes
    useEffect(() => {
        if (countries && props.value) {
            const selectedCountry = countries.find(
                (country) => country.id === props.value,
            );
            setCountryCode(selectedCountry?.code || '');
        } else {
            setCountryCode('');
        }
    }, [countries, props.value]);

    return (
        <Select
            {...props}
            data={
                regions?.map((region) => ({
                    value: region.id,
                    label: region.name,
                })) || []
            }
            disabled={!countryCode}
        />
    );
}
