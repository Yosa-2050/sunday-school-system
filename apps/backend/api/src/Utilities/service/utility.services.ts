import { BadRequestException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { DeleteResult, UpdateResult } from 'typeorm';
import { EntityNotFoundException } from '../ExceptionHandlers/Exceptions/notfound.exception';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UtilityServices {
    static EnsureUpdated(result: UpdateResult, id: string) {
        if (result.affected === 0) {
            throw new BadRequestException(
                `Update with ID ${id} failed, please contact your administrator`,
            );
        }
        return UtilityServices.SuccessIdResponse(id);
    }
    static EnsureMultipleUpdateds(
        result1: UpdateResult,
        result2: UpdateResult,
        id: string,
    ) {
        if (result1.affected === 0 && result2.affected === 0) {
            throw new BadRequestException(
                `Update with ID ${id} failed, please contact your administrator`,
            );
        }
        return UtilityServices.SuccessIdResponse(id);
    }

    static EnsureDeleted(result: DeleteResult, id: string) {
        if (result.affected === 0) {
            throw new BadRequestException(
                `Delete with ID ${id} failed, please contact your administartor`,
            );
        }
        return UtilityServices.SuccessIdResponse();
    }

    static EnsureCreated(id: string) {
        if (!id) {
            throw new BadRequestException('Unable to create');
        }
        return UtilityServices.SuccessIdResponse(id);
    }

    static SuccessIdResponse(id?: string) {
        return {
            data: id,
            sucess: true,
        };
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static SuccessDataResponse(data?: any) {
        return {
            data: data,
            sucess: true,
        };
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static SuccessDataResponseIfExists(data?: any, id?: string, type?: string) {
        if (!data) {
            throw new EntityNotFoundException(type, id);
        }
        return UtilityServices.SuccessDataResponse(data);
    }
}
