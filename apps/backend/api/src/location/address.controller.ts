import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from './address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateAddressDto } from './dto/request/create-address.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLocationRequestDto } from './dto/request/create-locaiton.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationType } from './enums/location-type.enums';

@ApiBearerAuth()
@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post()
    create(@Body() createAddressDto: CreateAddressDto) {
        // return this.addressService.create(createAddressDto);
    }

    @Post('location')
    createLocation(@Body() request: CreateLocationRequestDto) {
        // return this.addressService.createLocation(request);
    }

    @Get('location/:referenceId/:referenceType')
    getLocationByReference(
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
    ) {
        return this.addressService.getLocationByRefernce(
            referenceId,
            referenceType,
        );
    }

    @Get('contactsByReference/:referenceId/:referenceType')
    getContanctsByReference(
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
    ) {
        return this.addressService.getContactByRefernce(
            referenceId,
            referenceType,
        );
    }

    @Get('countries')
    findAll() {
        return this.addressService.findAllCountries();
    }

    @Get('locationByCountry/:countryCode/:type')
    GetLocationInfoByCountry(
        @Param('countryCode') countryCode: string,
        @Param('type') type: LocationType,
    ) {
        return this.addressService.findLocationByCountry(countryCode, type);
    }

    @Get('locationByParentId/:parentId')
    GetLocationInfoByParent(
        @Param('parentId', new ParseUUIDPipe()) parentId: string,
    ) {
        return this.addressService.findLocationInfoByParent(parentId);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.addressService.remove(+id);
    }
}
