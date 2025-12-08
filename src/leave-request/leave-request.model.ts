import { Employee } from 'src/employee/employee.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  type ILeaveRequestStatus,
  LeaveRequestStatus,
} from './leave-request.interface';

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  employeeId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: LeaveRequestStatus,
    default: LeaveRequestStatus.PENDING,
  })
  status: ILeaveRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Employee, (emp) => emp.leaveRequests)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
