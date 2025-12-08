import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeesRepo: EmployeeRepository) {}

  async create(dto: CreateEmployeeDto) {
    const existing = await this.employeesRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    return this.employeesRepo.create(dto);
  }

  async findOne(id: string) {
    const employee = await this.employeesRepo.findByIdWithHistory(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  // Helper for DepartmentsController
  async findByDepartment(departmentId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.employeesRepo.findByDepartment(
      departmentId,
      skip,
      limit,
    );

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
