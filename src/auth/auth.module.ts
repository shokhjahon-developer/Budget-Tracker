import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Register } from './entities';
import { RegisterDto } from './dto/register.dto';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([Register, RegisterDto]),
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AuthModule {}
