import { LocationType } from '../enums/location-type.enums';
export const addisAbabaZoneSeed = {
    parentName: 'Addis Ababa',
    parentType: LocationType.REGION,
    type: LocationType.ZONE,
    data: [
        {
            name: 'Addis Ababa',
            isRoot: true,
            hasChild: true,
        },
    ],
};

export const AmharaZoneSeed = {
    parentName: 'Amhara',
    parentType: LocationType.REGION,
    type: LocationType.ZONE,
    data: [
        {
            name: 'West Gojam',
            isRoot: true,
            hasChild: true,
        },
    ],
};

export const ethiopiaZoneSeedData = [
    {
        countryCode: 'ETH',
        data: [addisAbabaZoneSeed, AmharaZoneSeed],
    },
];
