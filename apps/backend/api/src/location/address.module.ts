import { Module } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { Country } from "./entities/country.entity";
import { LocationInfo } from "./entities/LocationInfo.entity";
import { CountrySeedService } from "./country-seed.service";
import { ContactDetails } from "./entities/contact-details.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactDetails, Location, Country, LocationInfo]),
  ],
  controllers: [AddressController],
  providers: [AddressService, CountrySeedService],
  exports: [AddressService, CountrySeedService],
})
export class AddressModule {
  constructor(private readonly countrySeedService: CountrySeedService) {}

  async onModuleInit(): Promise<void> {
    await this.countrySeedService.seedCountryData(); // Trigger data seeding on module initialization
    await this.countrySeedService.seedBaseLocationInfoData(); // Trigger data seeding on module initialization
    await this.countrySeedService.seedOtherLocationInfoDataByParentId();
  }
  
}
