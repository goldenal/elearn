import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface SendOtpEmailOptions {
  to: string;
  code: string;
  purpose: 'registration' | 'login' | 'password_reset';
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>(
      'RESEND_FROM_EMAIL',
      'noreply@eduhire.app',
    );

    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY is not configured. OTP emails will not be sent.',
      );
      this.resend = null;
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  async sendOtpEmail(options: SendOtpEmailOptions) {
    if (!this.resend) {
      this.logger.warn(
        `Attempted to send OTP email to ${options.to} but Resend client is not configured.`,
      );
      return;
    }

    const subject = 'Your EduHire verification code';
    const purposeCopy = this.renderPurposeCopy(options.purpose);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>EduHire Verification Code</h2>
        <p>${purposeCopy}</p>
        <p style="font-size: 24px; font-weight: bold;">${options.code}</p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `;

    await this.resend.emails.send({
      from: this.fromEmail,
      to: options.to,
      subject,
      html: htmlContent,
    });
  }

  private renderPurposeCopy(
    purpose: 'registration' | 'login' | 'password_reset',
  ): string {
    switch (purpose) {
      case 'registration':
        return 'Use the verification code below to complete your registration on EduHire.';
      case 'password_reset':
        return 'Use the verification code below to reset your EduHire password.';
      case 'login':
      default:
        return 'Use the verification code below to continue signing in to EduHire.';
    }
  }
}
