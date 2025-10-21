import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({
    description: 'Email address or phone number where the OTP should be sent',
    example: 'ada@example.com',
  })
  @IsNotEmpty()
  phoneOrEmail!: string;
}
