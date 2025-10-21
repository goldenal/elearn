import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import {
  JWT_ACCESS_TOKEN_TTL,
  OTP_EXPIRATION_MINUTES,
  PASSWORD_SALT_ROUNDS,
} from '../common/constants';
import { OTP } from '../models/otp.model';
import { User } from '../models/user.model';
import { MailerService } from '../mailer/mailer.service';

interface JwtPayload {
  sub: string;
  email: string;
}

const OTP_CODE_LENGTH = 4;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectModel(OTP)
    private readonly otpModel: typeof OTP,
  ) {}

  async register(registerDto: RegisterUserDto) {
    const existingUser = await this.usersService.findByEmail(
      registerDto.email.toLowerCase(),
    );

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const [firstName, ...rest] = registerDto.fullName.trim().split(/\s+/);
    const lastName = rest.length > 0 ? rest.join(' ') : firstName;

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      PASSWORD_SALT_ROUNDS,
    );

    const user = await this.usersService.createUser({
      firstName,
      lastName,
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
    });

    const token = await this.generateAccessToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken: token,
    };
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(
      loginDto.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateAccessToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken: token,
    };
  }

  async requestOtp(
    dto: RequestOtpDto,
    purpose: 'registration' | 'login' | 'password_reset' = 'login',
  ) {
    const code = this.generateOtpCode();
    const expiresAt = new Date(
      Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000,
    );

    await this.otpModel.update(
      { isVerified: true },
      {
        where: {
          phoneOrEmail: dto.phoneOrEmail,
          purpose,
          isVerified: false,
        },
      },
    );

    const otp = await this.otpModel.create({
      phoneOrEmail: dto.phoneOrEmail,
      code,
      purpose,
      expiresAt,
      isVerified: false,
    });

    const isEmailDestination = this.isEmail(dto.phoneOrEmail);

    if (isEmailDestination) {
      try {
        await this.mailerService.sendOtpEmail({
          to: dto.phoneOrEmail,
          code,
          purpose,
        });
      } catch (error) {
        this.logger.error(
          `Failed to send OTP email to ${dto.phoneOrEmail}`,
          error instanceof Error ? error.stack : undefined,
        );
        throw new BadRequestException('Failed to send OTP email');
      }
    } else {
      this.logger.warn(
        `OTP generated for ${dto.phoneOrEmail} but delivery is not implemented.`,
      );
    }

    return {
      message: 'OTP generated successfully',
      otpId: otp.id,
      deliveryMethod: isEmailDestination ? 'email' : 'unsupported',
    };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
    purpose: 'registration' | 'login' | 'password_reset' = 'login',
  ) {
    const otpRecord = await this.otpModel.findOne({
      where: {
        phoneOrEmail: dto.phoneOrEmail,
        code: dto.code,
        purpose,
        isVerified: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    return { message: 'OTP verified successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.sanitizeUser(user);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: JWT_ACCESS_TOKEN_TTL,
    });
  }

  private sanitizeUser(user: User) {
    const { password, ...userData } = user.get({ plain: true }) as User & {
      password?: string;
    };
    return userData;
  }

  private generateOtpCode(): string {
    const min = 10 ** (OTP_CODE_LENGTH - 1);
    const max = 10 ** OTP_CODE_LENGTH - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  private isEmail(destination: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination);
  }
}
