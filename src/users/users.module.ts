import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';
import { UserIsSelfGuard } from './guards/user-is-self.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Course, Enrollment]),
    PassportModule,
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserIsSelfGuard],
  exports: [UsersService],
})
export class UsersModule {}
