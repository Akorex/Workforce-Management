import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
