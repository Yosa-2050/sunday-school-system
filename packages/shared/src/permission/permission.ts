export const PERMISSION = {
    ALL: { All: { All: 'all:all:*all' } },
} as const;
// Type that matches PERMISSION’s inferred structure
type PermissionStructure = typeof PERMISSION;

type ExtractPermissionValues<T> = T extends Record<string, infer U>
    ? U extends Record<string, any>
        ? ExtractPermissionValues<U>
        : U extends string
          ? U
          : never
    : never;

export type PermissionType = ExtractPermissionValues<PermissionStructure>;
