import { Select } from "@mantine/core";
import type { SelectProps } from "@mantine/core";
import { useCountries } from "app/_api/profile/location";

export function CountrySelect(props: Omit<SelectProps, "data">) {
  const { data: countries } = useCountries();

  return (
    <Select
      {...props}
      data={
        countries?.map((country) => ({
          value: country.id,
          label: country.name,
        })) || []
      }
    />
  );
}
