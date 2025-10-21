import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully and access token returned',
  })
  @ApiBadRequestResponse({
    description: 'Email already exists or validation failed',
  })
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and obtain an access token' })
  @ApiOkResponse({
    description: 'User authenticated successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @Post('request-otp')
  @ApiOperation({ summary: 'Send an OTP to the supplied destination' })
  @ApiOkResponse({ description: 'OTP generated and delivery attempted' })
  @ApiBadRequestResponse({ description: 'OTP delivery failed' })
  requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto, 'login');
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify a previously requested OTP' })
  @ApiOkResponse({ description: 'OTP verified successfully' })
  @ApiBadRequestResponse({ description: 'Invalid or expired OTP' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto, 'login');
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request an OTP for password reset' })
  @ApiOkResponse({ description: 'OTP generated for password reset' })
  @ApiBadRequestResponse({ description: 'OTP delivery failed' })
  forgotPassword(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto, 'password_reset');
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve the currently authenticated user profile' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns the user profile data' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT access token',
  })
  getProfile(@Req() req: Request & { user: { sub: string } }) {
    return this.authService.getProfile(req.user.sub);
  }
}
