import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './leave-request.model';
import { LeaveRequestController } from './leave-request.controller';
import { LeaveRequestRepository } from './leave-request.repository';
import { LeaveRequestService } from './leave-request.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBITMQ_SERVICE } from 'src/common/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest]),
    ClientsModule.register([
      {
        name: RABBITMQ_SERVICE, // This string must match what you used in @Inject()
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
          ],
          queue: 'leave_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [LeaveRequestController],

  providers: [LeaveRequestRepository, LeaveRequestService],
})
export class LeaveRequestModule {}
