import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Department name must be at least 3 characters' })
  name: string;
}
