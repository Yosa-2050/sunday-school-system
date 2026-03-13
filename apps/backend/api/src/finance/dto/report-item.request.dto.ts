import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReportItemDto {
    @ApiProperty()
    @IsString()
    budgetLine: string;

    @ApiProperty()
    @IsString()
    documentType: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsString()
    reason: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    accountNumber?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    accountOwner?: string;
}
