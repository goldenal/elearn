import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'User full name that will be split into first and last name',
    example: 'Ada Lovelace',
  })
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    description: 'Unique email address for the account',
    example: 'ada@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Account password (minimum 8 characters)',
    minLength: 8,
    example: 'SuperSecure123',
  })
  @MinLength(8)
  password!: string;
}
