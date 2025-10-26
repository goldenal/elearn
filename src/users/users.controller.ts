import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserIsSelfGuard } from './guards/user-is-self.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(UserIsSelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(UserIsSelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  
  @Get(':id/courses')
  findCreatedCourses(@Param('id') id: string) {
    return this.usersService.findCreatedCourses(id);
  }

  @Get(':id/enrollments')
  findUserEnrollments(@Param('id') id: string) {
    return this.usersService.findUserEnrollments(id);
  }

  @UseGuards(UserIsSelfGuard)
  @Put(':id/password')
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @UseGuards(UserIsSelfGuard)
  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(id, file);
  }
}
