import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateEmployeeDto } from './dto/create-employee';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeeService) {}

  @Post()
  @ResponseMessage('Employee created successfully')
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get(':id')
  @ResponseMessage('Employee fetched successfully')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }
}
