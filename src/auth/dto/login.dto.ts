import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@gmail.com' })
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'johnpassword' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;
}
