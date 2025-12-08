import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './leave-request.model';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest])],
})
export class LeaveRequestModule {}
