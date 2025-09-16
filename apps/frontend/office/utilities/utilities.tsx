import { useMemo } from 'react';

export function useActiveSelection<T>(
    selectedSection: T | null | undefined,
    selectedClass: T | null | undefined,
) {
    return useMemo(
        () => selectedSection ?? selectedClass ?? null,
        [selectedSection, selectedClass],
    );
}
