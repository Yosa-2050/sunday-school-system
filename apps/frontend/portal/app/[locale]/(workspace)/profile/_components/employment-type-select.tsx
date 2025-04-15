import { Select } from "@mantine/core";
import type { SelectProps } from "@mantine/core";
import { useEmploymentTypes } from "app/_api/profile/queries";

export function EmploymentTypeSelect(props: Omit<SelectProps, "data">) {
  const { data: employmentTypes } = useEmploymentTypes();

  return (
    <Select
      {...props}
      data={
        employmentTypes?.map((type) => ({
          value: type.key,
          label: type.value,
        })) || []
      }
    />
  );
}
