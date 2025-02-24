import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationInfo } from './entities/LocationInfo.entity';
import { Country } from './entities/country.entity';
import { countrySeed } from './seeds/country.seed';
import { ethiopiaRegionSeedData } from './seeds/region.ethiopia.seed';
import { ethiopiaZoneSeedData } from './seeds/zone.ethiopia.seed';

@Injectable()
export class CountrySeedService {
    constructor(
        @InjectRepository(Country) private coutryRepo: Repository<Country>,
        @InjectRepository(LocationInfo)
        private locationInfoRepo: Repository<LocationInfo>,
    ) {}

    async seedCountryData(): Promise<void> {
        try {
            const allCountries = await this.coutryRepo.find(); // Get existing data
            const seedData = countrySeed;
            const addCountries: Country[] = [];
            for (let i = 0; i < seedData.length; i++) {
                const county = seedData[i];
                const countriesSaved = allCountries.find(
                    (x) => x.code === county.code,
                );

                if (!countriesSaved) {
                    addCountries.push(this.coutryRepo.create(county));
                }
            }
            if (addCountries.length > 0) {
                await this.coutryRepo.save(addCountries); // Seed new data
            }
        } catch (error) {
            //TODO: log error
            //console.error('Error seeding data:', error);
        }
    }

    async seedBaseLocationInfoData(): Promise<void> {
        try {
            const seedDatas = [...ethiopiaRegionSeedData];

            for (let x = 0; x < seedDatas.length; x++) {
                const seedData = seedDatas[x];
                const country = await this.coutryRepo.findOneBy({
                    code: seedData.countryCode,
                });
                if (!country) {
                    throw new NotFoundException('County not found');
                }
                const allLocation = await this.locationInfoRepo.findBy({
                    country: { code: seedData.countryCode },
                    type: seedData.type,
                }); // Get existing data
                const addLocations: LocationInfo[] = [];
                for (let i = 0; i < seedData.data.length; i++) {
                    const location = seedData.data[i];
                    const locationSaved = allLocation.find(
                        (x) => x.name === location.name,
                    );

                    if (!locationSaved) {
                        const locationCreate =
                            this.locationInfoRepo.create(location);
                        locationCreate.type = seedData.type;
                        locationCreate.country = country;
                        addLocations.push(locationCreate);
                    }
                }
                if (addLocations.length > 0) {
                    await this.locationInfoRepo.save(addLocations); // Seed new data
                }
            }
        } catch (error) {
            //TODO: Log error
            //console.error('Error seeding data:', error);
        }
    }

    async seedOtherLocationInfoDataByParentId(): Promise<void> {
        try {
            const seedDatas = [...ethiopiaZoneSeedData];
            const addLocations: LocationInfo[] = [];

            for (let x = 0; x < seedDatas.length; x++) {
                const mainData = seedDatas[x];
                const country = await this.coutryRepo.findOneBy({
                    code: mainData.countryCode,
                });
                if (!country) {
                    throw new NotFoundException('County not found');
                }
                const seedDataArray = mainData.data;
                for (let y = 0; y < seedDataArray.length; y++) {
                    const seedData = seedDataArray[y];
                    const parent = await this.locationInfoRepo.findOneBy({
                        name: seedData.parentName,
                        type: seedData.parentType,
                    });

                    const allLocation = await parent?.childs; // Get existing data
                    for (let i = 0; i < seedData.data.length; i++) {
                        const location = seedData.data[i];
                        const locationSaved = allLocation?.find(
                            (x) => x.name === location.name,
                        );

                        if (!locationSaved) {
                            const locationCreate =
                                this.locationInfoRepo.create(location);
                            locationCreate.type = seedData.type;
                            locationCreate.parent = parent;
                            locationCreate.country = country;
                            addLocations.push(locationCreate);
                        }
                    }
                }
            }
            if (addLocations.length > 0) {
                await this.locationInfoRepo.save(addLocations); // Seed new data
            }
        } catch (error) {
            //TODO: error log
            //console.error('Error seeding data:', error);
        }
    }
}
