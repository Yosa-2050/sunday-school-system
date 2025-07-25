/**
 * Converts an enum data object to an array of options for Mantine Select components
 * @param enumData - The enum data object with key-value pairs
 * @returns Array of options with value and label properties
 */
export const mapEnumToOptions = (enumData: Record<string, string>) => {
    return Object.entries(enumData).map(([key, value]) => ({
        value,
        label: key.replace(/_/g, ' '),
    }));
};
