import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Registered email address',
    example: 'ada@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Account password',
    minLength: 8,
    example: 'SuperSecure123',
  })
  @MinLength(8)
  password!: string;
}
