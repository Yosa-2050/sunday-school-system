import { LocationType } from '../enums/location-type.enums';

export const ethiopiaRegionSeed = [
    {
        name: 'Addis Ababa',
        parentId: '',
        isRoot: true,
        hasChild: true,
    },
    {
        name: 'Diredawa',
        parentId: '',
        isRoot: true,
        hasChild: true,
    },
    {
        name: 'Amhara',
        parentId: '',
        isRoot: true,
        hasChild: true,
    },
    {
        name: 'Afar',
        parentId: '',
        isRoot: true,
        hasChild: true,
    },
    {
        name: 'Tigray',
        parentId: '',
        isRoot: true,
        hasChild: true,
    },
    {
        name: 'Oromiya',
        parentId: '',
        isRoot: true,
        hasChild: true,
    },
    {
        name: 'Somalia',
        parentId: '',
        isRoot: true,
        hasChild: true,
    },
];

export const ethiopiaRegionSeedData = [
    {
        countryCode: 'ETH',
        type: LocationType.REGION,
        data: ethiopiaRegionSeed,
    },
];
