import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { LeaveRequestService } from './leave-request.service';
import { CreateLeaveDto } from './dto/create-leave-dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('leave-requests')
export class LeaveRequestController {
  private readonly logger = new Logger(LeaveRequestController.name);

  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post('submit')
  @ResponseMessage('Leave request submitted successfully')
  async create(@Body() dto: CreateLeaveDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end < start) {
      throw new BadRequestException('End date cannot be before start date');
    }

    return this.leaveRequestService.create(dto);
  }

  // Consumer endpoint
  @EventPattern('leave.requested')
  async handleLeaveRequested(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('WORKER RECEIVED MESSAGE:', data);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // 1. Delegate Logic to Service
      await this.leaveRequestService.processAutoApproval(data);

      // 2. Acknowledge Success (Removes from Queue)
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Error processing message:', error);
      channel.ack(originalMsg);
    }
  }
}
