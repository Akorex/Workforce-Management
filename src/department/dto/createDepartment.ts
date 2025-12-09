import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'IT', description: 'Department name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Department name must be at least 3 characters' })
  name: string;
}
