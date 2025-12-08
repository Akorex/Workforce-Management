import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MicroserviceHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ResponseMessage('System health check passed')
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),

      //   // 2. Check RabbitMQ
      //   () =>
      //     this.microservice.pingCheck('rabbitmq', {
      //       transport: Transport.RMQ,
      //       options: {
      //         urls: [
      //           process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
      //         ],
      //       },
      //     }),

      // 3. Check Heap Memory (Fail if > 150MB used)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
