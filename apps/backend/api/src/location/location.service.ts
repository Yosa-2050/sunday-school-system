import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLocationInfoRequestDto } from './dto/request/create-location-info.request.dto';
import { LocationInfo } from './entities/LocationInfo.entity';
import { Country } from './entities/country.entity';

export class LocationService {
    findById(id: string) {
        return this.locationInfoRepo.findOneBy({id});
    }
    constructor(
        @InjectRepository(Country)
        private readonly coutryRepo: Repository<Country>,
        @InjectRepository(LocationInfo)
        private readonly locationInfoRepo: Repository<LocationInfo>,
    ) {}

    async createLocationInfo(dto: CreateLocationInfoRequestDto) {
        const country = await this.coutryRepo.findOneBy({
            code: dto.countryId,
        });
        if (!country) {
            throw new BadRequestException('County not found');
        }
        const allLocation = await this.locationInfoRepo.findBy({
            country: { id: dto.countryId },
            type: dto.type,
        }); // Get existing data
        const addLocations: LocationInfo[] = [];
        for (let i = 0; i < dto.list.length; i++) {
            const name = dto.list[i];
            const locationSaved = allLocation.find((x) => x.name === name);

            if (!locationSaved) {
                const locationCreate = this.locationInfoRepo.create(location);
                locationCreate.type = dto.type;
                locationCreate.country = country;
                addLocations.push(locationCreate);
            }
        }
        if (addLocations.length > 0) {
            await this.locationInfoRepo.save(addLocations); // Seed new data
            return UtilityServices.SuccessResponse();
        }
    }
}
