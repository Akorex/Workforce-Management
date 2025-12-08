import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.model';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { DepartmentRepository } from './department.repository';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), EmployeeModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository],
  exports: [DepartmentService],
})
export class DepartmentModule {}
