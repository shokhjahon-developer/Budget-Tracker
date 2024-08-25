import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { Register } from 'src/auth/entities/register.entity';

export interface CreateBudgetResponse {
  budget: Budget;
  currentBudget: number;
}

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
    @InjectRepository(Register)
    private registerRepository: Repository<Register>,
  ) {}

  async create(
    createBudgetDto: CreateBudgetDto,
    user,
  ): Promise<CreateBudgetResponse> {
    const { title, description, amount, status } = createBudgetDto;

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      throw new Error('Invalid amount provided');
    }

    const budget = this.budgetsRepository.create({
      title,
      description,
      amount: numericAmount,
      status,
      user: user.id,
    });

    user.budget = Number(user.budget) || 0;
    user.budget += status === '+' ? numericAmount : -numericAmount;
    await this.registerRepository.save(user);

    const newBudget = await this.budgetsRepository.save(budget);

    const findUser = await this.registerRepository.findOne({
      where: { id: user.id },
    });

    if (!findUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    return {
      budget: newBudget,
      currentBudget: Number(findUser.budget) || 0,
    };
  }

  findAll(): Promise<Budget[]> {
    return this.budgetsRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Budget> {
    const budget = await this.budgetsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    return budget;
  }

  async update(
    id: string,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<CreateBudgetResponse> {
    // Find
    const budget = await this.findOne(id);
    const user = budget.user;

    const previousAmount = Number(budget.amount);
    if (isNaN(previousAmount)) {
      throw new Error('Invalid previous amount');
    }

    const previousStatus = budget.status;
    user.budget = Number(user.budget) || 0;
    user.budget += previousStatus === '+' ? -previousAmount : previousAmount;

    const { title, description, amount, status } = updateBudgetDto;

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      throw new Error('Invalid amount provided');
    }

    budget.title = title;
    budget.description = description;
    budget.amount = numericAmount;
    budget.status = status;

    user.budget += status === '+' ? numericAmount : -numericAmount;
    await this.registerRepository.save(user);

    const newBudget = await this.budgetsRepository.save(budget);

    const findUser = await this.registerRepository.findOne({
      where: { id: user.id },
    });

    if (!findUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    return {
      budget: newBudget,
      currentBudget: Number(findUser.budget) || 0,
    };
  }

  async remove(id: string): Promise<CreateBudgetResponse> {
    const budget = await this.findOne(id);
    const user = budget.user;

    const amount = budget.amount;
    const status = budget.status;
    user.budget += status === '+' ? -amount : amount;

    await this.budgetsRepository.delete(budget);
    const findUser = await this.registerRepository.findOne({
      where: { id: user.id },
    });

    return {
      budget: null,
      currentBudget: findUser.budget,
    };
  }
}
