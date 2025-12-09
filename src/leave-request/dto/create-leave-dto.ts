import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateLeaveDto {
  @ApiProperty({
    example: '2dcc1571-b7d3-47e8-aac4-240ec7421636',
    description: 'Employee ID',
  })
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({
    example: '2025-12-09',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string; // YYYY-MM-DD

  @ApiProperty({ example: '2025-12-10', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string; // YYYY-MM-DD
}
