import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CountrySeedService } from './country-seed.service';
import { LocationInfo } from './entities/LocationInfo.entity';
import { ContactDetails } from './entities/contact-details.entity';
import { Country } from './entities/country.entity';
import { Location } from './entities/location.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ContactDetails,
            Location,
            Country,
            LocationInfo,
        ]),
    ],
    controllers: [AddressController, LocationController],
    providers: [AddressService, CountrySeedService, LocationService],
    exports: [AddressService, CountrySeedService],
})
export class AddressModule {
    constructor(private readonly countrySeedService: CountrySeedService) {}

    async onModuleInit(): Promise<void> {
        await this.countrySeedService.seedCountryData2(); // Trigger data seeding on module initialization
        await this.countrySeedService.seedBaseLocationInfoData(); // Trigger data seeding on module initialization
        await this.countrySeedService.seedOtherLocationInfoDataByParentId();
    }
}
