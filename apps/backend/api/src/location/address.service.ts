import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { instanceToPlain } from 'class-transformer';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationModel } from './dto/model/location.model';
// biome-ignore lint/style/useImportType: <explanation>
import { ContactDetailsRequest } from './dto/request/contact-detail.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { IndividualAddressDto } from './dto/request/create-address.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateAddressDto } from './dto/request/update-address.dto';
import { LocationInfo } from './entities/LocationInfo.entity';
import { ContactDetails } from './entities/contact-details.entity';
import { Country } from './entities/country.entity';
import { Location } from './entities/location.entity';
import { ContactType } from './enums/contact-type.enums';
import { DefaultCountry } from './enums/location.const';

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

        return UtilityServices.EnsureCreated(reference);
    }

    async updateContactDetails(
        request: ContactDetailsRequest,
        reference: string,
        referenceType: ReferenceType,
    ) {
        await this.addressRepo.delete({
            reference: reference,
            referenceType: referenceType,
        });
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

        return UtilityServices.EnsureCreated(reference);
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

    async updateLocation(request: LocationModel, locationId: string) {
        const location = await this.locationRepo.findOneBy({ id: locationId });

        if (!location) {
            throw new EntityNotFoundException('Location');
        }

        location.locationData = instanceToPlain(request);
        location.isPreferred = request.isPreferred;
        location.addressType = request.addressType;

        return this.locationRepo.save(location);
    }

    async updateContactDetail(request: IndividualAddressDto, id: string) {
        const address = await this.addressRepo.findOneBy({ id });

        if (!address) {
            throw new EntityNotFoundException('Address');
        }

        address.isPreferred = request.isPreferred;
        address.value = request.value;

        return this.addressRepo.save(address);
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

    findDefaultCountry() {
        return this.countryRepo.findOneBy({ code: DefaultCountry });
    }

    findCountryById(id: string) {
        return this.countryRepo.findOneBy({ id });
    }

    findAllCountries() {
        return this.countryRepo.find({
            order: {
                name: 'ASC',
            },
        });
    }

    findLocationInfoById(id: string) {
        return this.locationInfoRepo.findOneBy({ id });
    }

    getLocationByReference(referenceId: string, referenceType: ReferenceType) {
        return this.locationRepo.findBy({
            reference: referenceId,
            referenceType: referenceType,
            isActive: true,
        });
    }

    getContactByReference(referenceId: string, referenceType: ReferenceType) {
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

    async removeLocation(id: string) {
        const remove = await this.locationRepo.delete({ id });
        return UtilityServices.EnsureDeleted(remove, id);
    }

    async removeContact(id: string) {
        const remove = await this.addressRepo.delete({ id });
        return UtilityServices.EnsureDeleted(remove, id);
    }

    async removeContactByReferenceId(
        referenceId: string,
        referenceType: ReferenceType,
    ) {
        const remove = await this.addressRepo.delete({
            reference: referenceId,
            referenceType: referenceType,
        });
        return UtilityServices.EnsureDeleted(remove, referenceId);
    }

    findAddressByReferenceId(referenceId: string) {
        return this.addressRepo.findBy({ reference: referenceId });
    }
    async findLocationById(id: string) {
        return UtilityServices.SuccessDataResponseIfExists(
            await this.locationRepo.findOneBy({ id }),
            id,
            'Location',
        );
    }

    findAddressById(id: string) {
        return this.addressRepo.findOneBy({ id });
    }
}
