import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

enum Status {
  income = '+',
  outcome = '-',
}

export class CreateBudgetDto {
  @ApiProperty({ example: 'Health' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  title: string;

  @ApiProperty({ example: 'I used it for purchasing medicine.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  description: string;

  @ApiProperty({ example: '-' })
  @IsNotEmpty()
  @IsEnum(Status)
  @IsString()
  status: Status;

  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  amount: number;

  user: string;
}
