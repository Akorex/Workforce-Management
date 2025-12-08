import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from './leave-request.model';
import { CreateLeaveDto } from './dto/create-leave-dto';
import {
  ILeaveRequestStatus,
  LeaveRequestStatus,
} from './leave-request.interface';

@Injectable()
export class LeaveRequestRepository {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly repo: Repository<LeaveRequest>,
  ) {}

  async create(data: CreateLeaveDto): Promise<LeaveRequest> {
    const leave = this.repo.create({
      ...data,
      status: LeaveRequestStatus.PENDING,
    });
    return this.repo.save(leave);
  }

  async findById(id: string): Promise<LeaveRequest | null> {
    return this.repo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: ILeaveRequestStatus): Promise<void> {
    await this.repo.update(id, { status });
  }
}
