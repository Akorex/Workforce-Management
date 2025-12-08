import {
  Post,
  Get,
  Body,
  Param,
  Controller,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Logger } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/createDepartment';
import { Department } from './department.model';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { EmployeeService } from 'src/employee/employee.service';

@Controller('departments')
export class DepartmentController {
  private readonly logger = new Logger(DepartmentController.name);
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @ResponseMessage('Department created successfully')
  async create(@Body() dto: CreateDepartmentDto): Promise<Department> {
    return this.departmentService.create(dto);
  }

  @Get()
  @ResponseMessage('Departments retrieved successfully')
  async findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Department retrieved successfully')
  async findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  @Get(':id/employees')
  @ResponseMessage('Department Employees retrieved successfully')
  async getEmployees(
    @Param('id') id: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    await this.departmentService.findOne(id);

    return this.employeeService.findByDepartment(id, page, limit);
  }
}
