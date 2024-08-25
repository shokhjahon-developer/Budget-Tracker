import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Register } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Register)
    private readonly registerRepo: Repository<Register>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async register({ email, fullname, password, budget }: RegisterDto) {
    const user = await this.registerRepo.findOne({ where: { email: email } });
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPass = await hash(password, 12);
    const insertUser = await this.registerRepo.insert({
      email,
      fullname,
      budget,
      password: hashedPass,
    });

    const newUser = insertUser.generatedMaps[0] as Register;

    const token = this.jwt.sign(
      { id: newUser.id },
      {
        secret: this.config.get('JWT_SECRET_KEY'),
        expiresIn: this.config.get('JWT_EXPIRATION'),
      },
    );
    return { data: token, newUser };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.registerRepo.findOne({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = await this.jwt.sign(
      { id: user.id },
      {
        secret: this.config.get('JWT_SECRET_KEY'),
        expiresIn: this.config.get('JWT_EXPIRATION'),
      },
    );
    return { data: token };
  }
}
