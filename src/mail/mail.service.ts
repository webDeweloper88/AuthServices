// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/confirm-email?token=${token}`;

    await this.transporter.sendMail({
        from: '"QuizApp" <webdeweloper88@gmail.com>',
        to: email,
        subject: 'Подтверждение Email',
        text: `Добро пожаловать в мир знаний и викторин! 🧠 Пожалуйста, подтвердите ваш email, чтобы начать свое интеллектуальное путешествие. Просто перейдите по следующей ссылке: ${url}`,
        html: `<p>Добро пожаловать в мир знаний и викторин! 🧠</p><p>Пожалуйста, подтвердите ваш email, чтобы начать свое интеллектуальное путешествие. Просто перейдите по следующей ссылке:</p><a href="${url}">${url}</a>`,
  
      })
  }
}
