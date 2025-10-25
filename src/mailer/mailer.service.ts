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

    const subject = 'Your Codehallam verification code';
    const purposeCopy = this.renderPurposeCopy(options.purpose);

    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            top: -50px;
            right: -50px;
        }
        
        .header::after {
            content: '';
            position: absolute;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            bottom: -30px;
            left: -30px;
        }
        
        .unicorn-icon {
            font-size: 60px;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
            position: relative;
            z-index: 1;
            letter-spacing: -0.5px;
        }
        
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .purpose-text {
            color: #555;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .code-section {
            margin: 35px 0;
            padding: 25px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
            border-radius: 15px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            position: relative;
        }
        
        .code-label {
            color: #999;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        
        .code {
            font-size: 48px;
            font-weight: 800;
            letter-spacing: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-family: 'Courier New', monospace;
            font-kerning: none;
        }
        
        .expiry {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #ff6b6b;
            font-size: 14px;
            font-weight: 600;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(102, 126, 234, 0.15);
        }
        
        .expiry-icon {
            font-size: 18px;
        }
        
        .security-note {
            background: #f8f9ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 25px 0;
            border-radius: 8px;
            text-align: left;
            font-size: 13px;
            color: #666;
            line-height: 1.6;
        }
        
        .security-note strong {
            color: #667eea;
            display: block;
            margin-bottom: 5px;
        }
        
        .footer {
            background: #f8f9ff;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e8ecf7;
        }
        
        .footer-text {
            color: #999;
            font-size: 12px;
            line-height: 1.6;
        }
        
        .footer-text a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        
        .star {
            display: inline-block;
            margin: 0 3px;
            color: #667eea;
            opacity: 0.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="unicorn-icon">🦄</div>
            <h1>Codehallam</h1>
            <p>Secure Verification</p>
        </div>
        
        <div class="content">
            <p class="purpose-text">
                ${purposeCopy}
            </p>
            
            <div class="code-section">
                <div class="code-label">Your verification code</div>
                <div class="code">${options.code}</div>
                <div class="expiry">
                    <span class="expiry-icon">⏱️</span>
                    <span>Code expires in <strong>10 minutes</strong></span>
                </div>
            </div>
            
            <div class="security-note">
                <strong>🔒 Security Reminder</strong>
                Never share this code with anyone. We will never ask for your verification code via email or message.
            </div>
            
            <p style="color: #ccc; font-size: 20px; margin: 20px 0;">
                <span class="star">✨</span>
                <span class="star">✨</span>
                <span class="star">✨</span>
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2025 Codehallam. All rights reserved.<br>
                <a href="#">Privacy Policy</a> • <a href="#">Security</a> • <a href="#">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;

    await this.resend.emails.send({
      from: "verify@codehallam.useketra.com",
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
        return 'Use the verification code below to complete your registration on Codehallam.';
      case 'password_reset':
        return 'Use the verification code below to reset your Codehallam password.';
      case 'login':
      default:
        return 'Use the verification code below to continue signing in to Codehallam.';
    }
  }
}
