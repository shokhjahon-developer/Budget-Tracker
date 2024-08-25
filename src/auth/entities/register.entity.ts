import { Budget } from 'src/budgets/entities/budget.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Register {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 128 })
  fullname: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  email: string;

  @Column({ type: 'numeric', default: 0 })
  budget: number;

  @Column({ type: 'varchar', length: 128 })
  password: string;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
