// Base interfaces
export interface BaseEntity {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
}

// Contact related types
export type ContactType = 'Phone' | 'Email' | 'Other';
export type ContactCategory = 'Mobile' | 'Communication' | 'Default';
export type ReferenceType = 'Organization' | 'Individual';

export interface Contact extends BaseEntity {
    reference: string;
    type: ContactCategory;
    contactType: ContactType;
    value: string;
    isPreferred: boolean;
    referenceType: ReferenceType;
}

// Location related types
export interface LocationData {
    country: string;
    region: string;
    city: string;
    subcity: string;
    woreda: string;
    houseNumber: string;
    addressType: string;
    addressText: string;
    latitude: string;
    longitude: string;
    isPreferred: boolean;
    village: string;
}

export interface Location extends BaseEntity {
    reference: string;
    locationData: LocationData;
    addressType: string;
    isPreferred: boolean;
    referenceType: ReferenceType;
}

// Sector related types
export interface Sector extends BaseEntity {
    name: string;
    isRoot: boolean;
    hasChild: boolean;
}

// Organization related types
export type OrganizationType =
    | 'Partnership'
    | 'Corporation'
    | 'LLC'
    | 'Sole Proprietorship'
    | 'Non-Profit';
export type OrganizationStatus =
    | 'APPROVED'
    | 'New'
    | 'REQUEST_APPROVAL'
    | 'DECLINED';
export type CompanySize =
    | 'Micro-sized: 1 to 9 employees'
    | 'Small-sized: 10 to 49 employees'
    | 'Medium-sized: 50 to 249 employees'
    | 'Large-sized: 250+ employees';

export interface Organization extends BaseEntity {
    name: string;
    registrationNumber: string;
    description: string;
    displayName: string;
    note: string;
    type: OrganizationType;
    yearFounded: string;
    companySize: CompanySize;
    hasBranches: boolean;
    status: OrganizationStatus;
    sector: Sector;
    contacts: Contact[];
    locations: Location[];
}

// Props for the component
export interface OrganizationDetailsProps {
    organization: Organization;
    onEdit?: (organization: Organization) => void;
    onDelete?: (organizationId: string) => void;
    readonly?: boolean;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Form types for editing
export interface OrganizationFormData {
    name: string;
    registrationNumber: string;
    description: string;
    displayName: string;
    note: string;
    type: OrganizationType;
    yearFounded: string;
    companySize: CompanySize;
    hasBranches: boolean;
    sectorId: string;
}

export interface ContactFormData {
    type: ContactCategory;
    contactType: ContactType;
    value: string;
    isPreferred: boolean;
}

export interface LocationFormData {
    country: string;
    region: string;
    city: string;
    subcity: string;
    woreda: string;
    houseNumber: string;
    addressType: string;
    addressText: string;
    latitude: string;
    longitude: string;
    isPreferred: boolean;
    village: string;
}

// Utility types
export type OrganizationSummary = Pick<
    Organization,
    'id' | 'name' | 'displayName' | 'status' | 'type' | 'createdAt'
>;

export interface OrganizationFilters {
    status?: OrganizationStatus[];
    type?: OrganizationType[];
    companySize?: CompanySize[];
    sectorId?: string;
    hasBranches?: boolean;
    createdAfter?: string;
    createdBefore?: string;
    search?: string;
}

export interface OrganizationSortOptions {
    field: keyof Organization;
    direction: 'asc' | 'desc';
}
