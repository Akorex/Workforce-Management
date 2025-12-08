import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/createDepartment';
import { Department } from './department.model';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentsRepo: DepartmentRepository) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentsRepo.findOneByName(dto.name);
    if (existing) {
      throw new ConflictException('Department already exists');
    }
    return this.departmentsRepo.create(dto);
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentsRepo.findOneById(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async findAll(): Promise<Department[]> {
    return this.departmentsRepo.findAll();
  }
}
