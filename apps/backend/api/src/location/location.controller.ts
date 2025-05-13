import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from './address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLocationInfoRequestDto } from './dto/request/create-location-info.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationType } from './enums/location-type.enums';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
        private readonly addressService: AddressService,
    ) {}

    @Post()
    createLocation(@Body() request: CreateLocationInfoRequestDto) {
        return this.locationService.createLocationInfo(request);
    }

    @Get('countries')
    findAll() {
        return this.addressService.findAllCountries();
    }

    @Get(':id')
    getById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.locationService.findById(id);
    }

    @Get('locationByCountry/:countryCode/:type')
    GetLocationInfoByCountry(
        @Param('countryCode') countryCode: string,
        @Param('type') type: LocationType,
    ) {
        return this.locationService.findLocationByCountry(countryCode, type);
    }

    @Get('locationByCountryId/:countryId/:type')
    GetLocationInfoByCountryId(
        @Param('countryId', new ParseUUIDPipe()) countryId: string,
        @Param('type') type: LocationType,
    ) {
        return this.locationService.findLocationByCountryId(countryId, type);
    }

    @Get('locationByParentId/:parentId')
    GetLocationInfoByParent(
        @Param('parentId', new ParseUUIDPipe()) parentId: string,
    ) {
        return this.locationService.findLocationInfoByParent(parentId);
    }
}
