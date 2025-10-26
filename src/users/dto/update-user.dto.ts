import {
  IsString,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsUrl()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
