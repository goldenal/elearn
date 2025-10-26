import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { CreationAttributes } from 'sequelize';
import { RegisterUserDto } from '../auth/dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
    @InjectModel(Enrollment)
    private readonly enrollmentModel: typeof Enrollment,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException(
        'At least one field to update must be provided',
      );
    }
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.update(updateUserDto as Partial<User>);
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.destroy();
  }

  async findCreatedCourses(userId: string): Promise<Course[]> {
    return this.courseModel.findAll({ where: { instructorId: userId } });
  }

  async findUserEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentModel.findAll({
      where: { userId },
      include: [Course],
    });
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.scope('withPassword').findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await user.update({ password: hashedPassword });
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const avatarUrl = `/uploads/${file.filename}`;
    await user.update({ profileImage: avatarUrl });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.scope('withPassword').findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData as CreationAttributes<User>);
  }
}
