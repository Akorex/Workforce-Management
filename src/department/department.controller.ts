import { Patch, Post, Get, Body, Param, Controller } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Logger } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/createDepartment';
import { Department } from './department.model';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('departments')
export class DepartmentController {
  private readonly logger = new Logger(DepartmentController.name);
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ResponseMessage('Department created successfully')
  async create(@Body() dto: CreateDepartmentDto): Promise<Department> {
    this.logger.log(`Creating department: ${dto.name}`);
    return this.departmentService.create(dto);
  }

  //   @Get()
  //   async findAll(): Promise<Department[]> {
  //     this.logger.log('Finding all departments');
  //     return this.departmentService.findAll();
  //   }

  //   @Get(':id')
  //   async findOne(@Param('id') id: string): Promise<Department> {
  //     this.logger.log(`Finding department by id: ${id}`);
  //     return this.departmentService.findOne(id);
  //   }
}
