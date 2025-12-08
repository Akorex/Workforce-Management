import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequestRepository } from './leave-request.repository';
import { RABBITMQ_SERVICE } from 'src/common/constants';

describe('LeaveRequestService', () => {
  let service: LeaveRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaveRequestService,
        { provide: LeaveRequestRepository, useValue: { create: jest.fn() } }, // Mock Repo
        { provide: RABBITMQ_SERVICE, useValue: { emit: jest.fn() } }, // Mock RabbitMQ
      ],
    }).compile();

    service = module.get<LeaveRequestService>(LeaveRequestService);
  });

  it('should calculate days correctly (inclusive)', () => {
    // Access private method using 'any' bypass for quick testing
    const result = (service as any).calculateDays(
      new Date('2025-12-01'),
      new Date('2025-12-03'),
    );
    expect(result).toBe(3); // 1st, 2nd, 3rd = 3 days
  });

  it('should return 1 day if start and end are the same', () => {
    const result = (service as any).calculateDays(
      new Date('2025-12-01'),
      new Date('2025-12-01'),
    );
    expect(result).toBe(1);
  });
});
