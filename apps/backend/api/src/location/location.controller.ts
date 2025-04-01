import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLocationInfoRequestDto } from './dto/request/create-location-info.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationService } from './location.service';

@ApiBearerAuth()
@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Post()
    createLocation(@Body() request: CreateLocationInfoRequestDto) {
        return this.locationService.createLocationInfo(request);
    }
}
