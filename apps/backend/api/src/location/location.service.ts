import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLocationInfoRequestDto } from './dto/request/create-location-info.request.dto';
import { LocationInfo } from './entities/LocationInfo.entity';
import { Country } from './entities/country.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationType } from './enums/location-type.enums';

export class LocationService {
    findById(id: string) {
        return this.locationInfoRepo.findOneBy({ id });
    }
    constructor(
        @InjectRepository(Country)
        private readonly coutryRepo: Repository<Country>,
        @InjectRepository(LocationInfo)
        private readonly locationInfoRepo: Repository<LocationInfo>,
    ) {}

    async createLocationInfo(dto: CreateLocationInfoRequestDto) {
        const country = await this.coutryRepo.findOneBy({
            id: dto.countryId,
        });
        if (!country) {
            throw new EntityNotFoundException('County');
        }
        const allLocation = await this.locationInfoRepo.findBy({
            country: { id: dto.countryId },
            parent: { id: dto.parentId },
            type: dto.type,
        }); // Get existing data

        const parent = await this.locationInfoRepo.findOneBy({
            id: dto.parentId,
        });

        if (dto.parentId && !parent) {
            throw new BadRequestException('Parent location not found');
        }
        const addLocations: LocationInfo[] = [];
        for (let i = 0; i < dto.list.length; i++) {
            const name = dto.list[i];
            const locationSaved = allLocation.find(
                (x) => x.name === name && parent.id === dto.parentId,
            );

            if (!locationSaved) {
                const locationCreate = this.locationInfoRepo.create();
                locationCreate.parent = parent;
                locationCreate.name = name;
                locationCreate.type = dto.type;
                locationCreate.country = country;
                locationCreate.isRoot = !!dto.parentId;
                addLocations.push(locationCreate);
            }
        }
        if (addLocations.length > 0) {
            const add = await this.locationInfoRepo.save(addLocations); // Seed new data
            if (add) {
                return UtilityServices.SuccessIdResponse();
            }
            throw new BadRequestException('unable to add information');
        }
        throw new BadRequestException('No information to be added');
    }

    findLocationByCountry(countryCode: string, type: LocationType) {
        return this.locationInfoRepo.findBy({
            country: { code: countryCode },
            type: type,
        });
    }

    findLocationByCountryId(id: string, type: LocationType) {
        return this.locationInfoRepo.findBy({
            country: { id: id },
            type: type,
        });
    }

    findLocationInfoByParent(parentId: string) {
        return this.locationInfoRepo.findBy({ parent: { id: parentId } });
    }
}
