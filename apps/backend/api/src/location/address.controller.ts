import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from './address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationModel } from './dto/model/location.model';
// biome-ignore lint/style/useImportType: <explanation>
import {
    ContactDetailsRequest,
    LocationListRequest,
} from './dto/request/contact-detail.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { IndividualAddressDto } from './dto/request/create-address.dto';

@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post('location/:referenceId/:referenceType')
    createLocation(
        @Body() request: LocationListRequest,
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
    ) {
        return this.addressService.createLocation(
            request.location,
            referenceId,
            referenceType,
        );
    }

    @Patch('location/:locationId')
    updateLocation(
        @Body() request: LocationModel,
        @Param('locationId') referenceId: string,
    ) {
        return this.addressService.updateLocation(request, referenceId);
    }

    @Get('location/:id')
    getLocation(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.addressService.findLocationById(id);
    }

    @Delete('location/:id')
    removeLocation(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.addressService.removeLocation(id);
    }

    @Post('contacts/:referenceId/:referenceType')
    createContactDetails(
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
        @Body() request: ContactDetailsRequest,
    ) {
        return this.addressService.createContactDetails(
            request,
            referenceId,
            referenceType,
        );
    }

    @Put('contacts/:referenceId/:referenceType')
    updateContactDetails(
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
        @Body() request: ContactDetailsRequest,
    ) {
        return this.addressService.updateContactDetails(
            request,
            referenceId,
            referenceType,
        );
    }

    @Patch('contacts/:id')
    updateContactDetail(
        @Body() request: IndividualAddressDto,
        @Param('id') id: string,
    ) {
        return this.addressService.updateContactDetail(request, id);
    }

    @Get('contacts/:referenceId/:referenceType')
    getContactsByReference(
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
    ) {
        return this.addressService.getContactByReference(
            referenceId,
            referenceType,
        );
    }

    @Delete('contact/:id')
    removecantactDetails(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.addressService.removeContact(id);
    }

    @Delete('contactsByReference/:referenceId/:referenceType')
    removecantactDetailsByReference(
        @Param('referenceId') referenceId: string,
        @Param('referenceType') referenceType: ReferenceType,
    ) {
        return this.addressService.removeContactByReferenceId(
            referenceId,
            referenceType,
        );
    }
}
