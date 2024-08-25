import { Register } from 'src/auth/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', length: 128 })
  description: string;

  @Column({ type: 'numeric', default: 0 })
  amount: number;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(() => Register, (register) => register.budgets)
  user: Register;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
