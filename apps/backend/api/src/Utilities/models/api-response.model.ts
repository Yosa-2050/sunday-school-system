
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ required: false })
  errors?: string[];

  constructor(statusCode: number, message?: string, data?: T, errors?: string[]) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message ?? this.success ? "Success" : "Failed";
    this.data = data;
    this.errors = errors;
  }
}
