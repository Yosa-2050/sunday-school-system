import { plainToInstance } from 'class-transformer';
// utils/excel.utils.ts
import * as XLSX from 'xlsx';
// import { validate } from 'class-validator';

export function parseExcel<T>(buffer: Buffer, dtoClass: new () => T) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const valid: T[] = [];
    const errors: any[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        // map to DTO
        const dto = plainToInstance(dtoClass, row, {
            enableImplicitConversion: true,
        });
        valid.push(dto);

        // validate
        //const validationErrors = await validate(dto);

        // if (validationErrors.length > 0) {
        //   errors.push({
        //     row: i + 2, // Excel row index (+2 accounts for header row)
        //     data: row,
        //     errors: validationErrors.map(e => ({
        //       field: e.property,
        //       constraints: e.constraints,
        //     })),
        //   });
        // } else {
        //   valid.push(dto);
        // }
    }

    return valid;
}
