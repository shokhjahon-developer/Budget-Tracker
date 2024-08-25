import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  fullname: string;

  @ApiProperty({ example: 'john@gmail.com' })
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 5000 })
  @IsNotEmpty()
  @IsNumber()
  budget: number;

  @ApiProperty({ example: 'johnpassword' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;
}
