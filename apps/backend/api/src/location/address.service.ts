import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { ReferenceType } from 'src/Utilities/enums/reference-type.enum';
import { Repository } from 'typeorm';
import { LocationModel } from './dto/model/location.model';
import { ContactDetailsRequest } from './dto/request/contact-detail.request.dto';
import { IndividualAddressDto } from './dto/request/create-address.dto';
import { UpdateAddressDto } from './dto/request/update-address.dto';
import { LocationInfo } from './entities/LocationInfo.entity';
import { ContactDetails } from './entities/contact-details.entity';
import { Country } from './entities/country.entity';
import { Location } from './entities/location.entity';
import { ContactType } from './enums/contact-type.enums';
import { LocationType } from './enums/location-type.enums';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Location) private locationRepo: Repository<Location>,
        @InjectRepository(ContactDetails)
        private addressRepo: Repository<ContactDetails>,
        @InjectRepository(Country) private countryRepo: Repository<Country>,
        @InjectRepository(LocationInfo)
        private locationInfoRepo: Repository<LocationInfo>,
    ) {}

    createContactDetails(
        request: ContactDetailsRequest,
        reference: string,
        referenceType: ReferenceType,
    ) {
        const createAddressDto = [];
        const emails = request.emailAddress?.map((x) => ({
            ...x,
            contactType: ContactType.Email,
        }));

        const phones = request.phoneNumbers?.map((x) => ({
            ...x,
            contactType: ContactType.Phone,
        }));

        const other = request.otherAddress?.map((x) => ({
            ...x,
            contactType: ContactType.Other,
        }));

        if (emails) {
            createAddressDto.push(...emails);
        }
        if (phones) {
            createAddressDto.push(...phones);
        }
        if (other) {
            createAddressDto.push(...other);
        }

        this.create(createAddressDto, reference, referenceType);
        this.createLocation(request.location, reference, referenceType);
    }

    createLocation(
        request: LocationModel[],
        reference: string,
        referenceType: ReferenceType,
    ) {
        const locations = request.map((loc) => {
            const location = this.locationRepo.create();
            location.locationData = instanceToPlain(loc);
            location.reference = reference;
            location.referenceType = referenceType;
            location.isPreferred = loc.isPreferred;
            location.addressType = loc.addressType;
            return location;
        });

        return this.locationRepo.save(locations);
    }

    create(
        request: IndividualAddressDto[],
        reference: string,
        referenceType: ReferenceType,
    ) {
        const address = request.map((add) => {
            const address = this.addressRepo.create(add);
            address.reference = reference;
            address.referenceType = referenceType;
            return address;
        });
        return this.addressRepo.save(address);
    }

    findAllCountries() {
        return this.countryRepo.find();
    }

    findLocationByParent(parentId: string) {
        return this.locationInfoRepo.findBy({ parent: { id: parentId } });
    }

    findLocationByCountry(countryCode: string, type: LocationType) {
        return this.locationInfoRepo.findBy({
            country: { code: countryCode },
            type: type,
        });
    }

    getLocationByRefernce(referenceId: string, referenceType: ReferenceType) {
        return this.locationRepo.findBy({
            reference: referenceId,
            referenceType: referenceType,
            isActive: true,
        });
    }

    getContanctByRefernce(referenceId: string, referenceType: ReferenceType) {
        return this.addressRepo.findBy({
            reference: referenceId,
            referenceType: referenceType,
            isActive: true,
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} address`;
    }

    update(id: number, updateAddressDto: UpdateAddressDto) {
        return `This action updates a #${id} address`;
    }

    remove(id: number) {
        return `This action removes a #${id} address`;
    }
    findAddressByReferenceId(referenceId: string) {
        return this.addressRepo.findBy({ reference: referenceId });
    }
    findLocationById(id: string) {
        return this.locationRepo.findOneBy({ id });
    }
}
