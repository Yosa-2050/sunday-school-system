import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import type { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from './address.service';
import type { CreateAddressDto } from './dto/request/create-address.dto';
import type { CreateLocationRequestDto } from './dto/request/create-locaiton.request.dto';
import type { LocationType } from './enums/location-type.enums';

@Public()
@ApiBearerAuth()
@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post()
    @ApiExcludeEndpoint()
    create(@Body() createAddressDto: CreateAddressDto) {
        // return this.addressService.create(createAddressDto);
    }

    @ApiExcludeEndpoint()
    @Post('location')
    createLocation(@Body() request: CreateLocationRequestDto) {
        // return this.addressService.createLocation(request);
    }

    @ApiExcludeEndpoint()
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

    @ApiExcludeEndpoint()
    @Get(':referenceId/:referenceType')
    getContanctsByReference(
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
    ) {
        return this.addressService.getContanctByRefernce(
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
        return this.addressService.findLocationByParent(parentId);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.addressService.remove(+id);
    }
}
