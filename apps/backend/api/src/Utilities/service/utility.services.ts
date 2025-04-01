import { BadRequestException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { DeleteResult, UpdateResult } from 'typeorm';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UtilityServices {
    static EnsureUpdated(result: UpdateResult, id: string) {
        if (result.affected === 0) {
            throw new BadRequestException(
                `Update with ID ${id} failed, please contact your administrator`,
            );
        }
        return {
            sucess: 'true',
        };
    }

    static EnsureDeleted(result: DeleteResult, id: string) {
        if (result.affected === 0) {
            throw new BadRequestException(
                `Delete with ID ${id} failed, please contact your administartor`,
            );
        }
        return {
            sucess: 'true',
        };
    }
}
