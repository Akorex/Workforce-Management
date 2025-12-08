import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.model';
import { CreateEmployeeDto } from './dto/create-employee';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async create(data: CreateEmployeeDto): Promise<Employee> {
    const employee = this.repo.create(data);
    return this.repo.save(employee);
  }

  async findByIdWithHistory(id: string): Promise<Employee | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['leaveRequests', 'department'],
      order: {
        leaveRequests: {
          createdAt: 'DESC', // Show newest leaves first
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByDepartment(departmentId: string, skip: number, take: number) {
    return this.repo.findAndCount({
      where: { departmentId },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }
}
