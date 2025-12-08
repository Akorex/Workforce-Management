import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateLeaveDto {
  @IsNotEmpty()
  employeeId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string; // YYYY-MM-DD

  @IsDateString()
  @IsNotEmpty()
  endDate: string; // YYYY-MM-DD
}
