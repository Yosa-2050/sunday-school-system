import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllEnums } from './enums/allEnums';

@ApiTags('enums')
@Controller('enums')
export class EnumsController {
    @Get(':enumType')
    getEnumByType(@Param('enumType') enumType: string) {
        // Retrieve and return the specified enum based on the provided type
        // You can dynamically fetch and return enums based on your implementation

        const selectedEnum = AllEnums[enumType];

        if (!selectedEnum) {
            // Handle the case where the specified enum type is not found
            return { error: 'Enum type not found' };
        }

        return { data: selectedEnum };
    }

    @Get()
    getAllEnumTypes() {
        return AllEnums;
    }
}
