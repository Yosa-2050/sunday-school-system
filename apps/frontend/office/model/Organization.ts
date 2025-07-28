interface Profile {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    mothersFullName: string | null;
    birthDate: string | null;
    dobGregorian: string | null;
    gender: string | null;
    marriageStatus: string | null;
    title: string | null;
    phoneNumber: string | null;
    profile_picture_id: string | null;
}

interface Employee {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    id_number: string | null;
    profile: Profile;
}

interface OrganizationEmployee {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    type: string;
    employee: Employee;
}

interface Contact {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    reference: string;
    type: string;
    contactType: string;
    value: string;
    isPreferred: boolean;
    referenceType: string;
}

interface Location {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    reference: string;
    isPreferred: boolean;
    referenceType: string;
    locationData: {
        country: string;
        region: string;
        city: string;
        subcity: string;
        woreda: string;
        houseNumber: string;
        subCity: string;
    };
}

interface Note {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    content: string;
    type: string;
    note: string;
}

interface Organization {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    name: string;
    registrationNumber: string;
    description: string;
    displayName: string;
    type: string;
    yearFounded: string;
    logo: string | null;
    companySize: string;
    hasBranches: boolean;
    status: string;
    corporateEmail: string | null;
    industry: {
        id: string;
        createdBy: string;
        createdAt: string;
        isActive: boolean;
        code: string;
        value: string;
        description: string;
        group: string;
        subGroup: string;
    } | null;
    contacts: Contact[];
    locations: Location;
    notes: Note[];
    __employee__: OrganizationEmployee[];
    __has_employee__: boolean;
}

export type {
    Organization,
    Contact,
    Employee,
    Location,
    Note,
    OrganizationEmployee,
    Profile,
};
