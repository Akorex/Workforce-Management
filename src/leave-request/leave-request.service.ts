import { Inject, Injectable } from '@nestjs/common';
import { LeaveRequestRepository } from './leave-request.repository';
import { CreateLeaveDto } from './dto/create-leave-dto';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_SERVICE } from 'src/common/constants';
import { Logger } from '@nestjs/common';
import { LeaveRequestStatus } from './leave-request.interface';

@Injectable()
export class LeaveRequestService {
  private readonly logger = new Logger(LeaveRequestService.name);

  constructor(
    private readonly leaveRepo: LeaveRequestRepository,
    @Inject(RABBITMQ_SERVICE) private readonly rabbitClient: ClientProxy,
  ) {}

  async create(dto: CreateLeaveDto) {
    const leaveRequest = await this.leaveRepo.create(dto);

    const days = this.calculateDays(
      new Date(dto.startDate),
      new Date(dto.endDate),
    );

    this.rabbitClient.emit('leave.requested', {
      leaveId: leaveRequest.id,
      days: days,
    });

    this.logger.log(`Leave request ${leaveRequest.id} created successfully`);

    return leaveRequest;
  }

  async processAutoApproval(data: { leaveId: string; days: number }) {
    this.logger.log(`Processing leave request ${data.leaveId}`);

    const leaveRequest = await this.leaveRepo.findById(data.leaveId);

    if (!leaveRequest) {
      this.logger.error(`Leave request ${data.leaveId} not found`);
      return;
    }

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      this.logger.warn(
        `Leave request ${data.leaveId} already processed. Skipping.`,
      );
      return;
    }

    const newStatus =
      data.days <= 2
        ? LeaveRequestStatus.APPROVED
        : LeaveRequestStatus.PENDING_APPROVAL;

    await this.leaveRepo.updateStatus(leaveRequest.id, newStatus);
    this.logger.log(`Leave request ${data.leaveId} updated to ${newStatus}`);
  }

  private calculateDays(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}
