import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { postgresConfig } from '@config';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('db.url'),
        entities: [],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    JwtModule.register({ global: true }),
    AuthModule,
    BudgetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
