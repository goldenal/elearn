import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Destination that received the OTP (email or phone)',
    example: 'ada@example.com',
  })
  @IsNotEmpty()
  phoneOrEmail!: string;

  @ApiProperty({
    description: 'OTP verification code received by the user',
    example: '1234',
  })
  @IsNotEmpty()
  code!: string;
}
