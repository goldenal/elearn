import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { CreationAttributes, FindOptions } from 'sequelize';

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

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    await user.update(updateUserDto);
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    await user.update({ isActive: false });
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
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
    // In a real application, you would upload the file to a cloud storage service
    // and save the URL in the database.
    const avatarUrl = `/uploads/${file.filename}`;
    await user.update({ profileImage: avatarUrl });
    return user;
  }

  async findOneByEmail(email: string, includePassword = false): Promise<User | null> {
    const findOptions: FindOptions = {
      where: { email },
    };

    if (includePassword) {
      findOptions.attributes = {
        include: ['password'],
      };
    }

    return this.userModel.findOne(findOptions);
  }

  async create(createUserDto: CreationAttributes<User>): Promise<User> {
    return this.userModel.create(createUserDto);
  }
}
