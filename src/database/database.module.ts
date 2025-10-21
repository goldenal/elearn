import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeModels } from '../models';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        url: process.env.DATABASE_URL,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'postgres'),
        autoLoadModels: true,
        synchronize: false,
        logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
        models: [...sequelizeModels],
        dialectOptions:
         { ssl: { require: true, rejectUnauthorized: false } }
           
      }),
    }),
    SequelizeModule.forFeature([...sequelizeModels]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
