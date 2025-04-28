import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from './address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLocationRequestDto } from './dto/request/create-locaiton.request.dto';

@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    // @Post()
    // create(@Body() createAddressDto: CreateAddressDto) {
    //     // return this.addressService.create(createAddressDto);
    // }

    @Post()
    createLocation(@Body() request: CreateLocationRequestDto) {
        // return this.addressService.createLocation(request);
    }

    @Get('/:referenceId/:referenceType')
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

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.addressService.remove(+id);
    }
}
