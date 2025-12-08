import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.model';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/createDepartment';

@Injectable()
export class DepartmentRepository {
  constructor(
    @InjectRepository(Department) private readonly repo: Repository<Department>,
  ) {}

  async create(data: CreateDepartmentDto): Promise<Department> {
    const department = this.repo.create(data);
    return this.repo.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.repo.find({ relations: { employees: true } });
  }

  async findOneById(id: string): Promise<Department | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<Department | null> {
    return this.repo.findOne({ where: { name } });
  }
}
