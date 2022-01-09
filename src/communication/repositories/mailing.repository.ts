import { MailerService } from '@nestjs-modules/mailer';
import fs from 'fs';
import { compile } from 'handlebars';
import mjml2html from 'mjml';

import { Injectable } from '@nestjs/common';

import { ConfigService, LoggerService } from '@xyz/core';

interface SendMail {
  template: string;
  to: string;
  subject: string;
  context: any;
  [key: string]: any;
}

@Injectable()
export class MailingRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(MailingRepository.name);
  }

  async sendMail(params: SendMail): Promise<void> {
    this.loggerService.log('MailingRepository#sendMail - params', {
      params,
    });

    const { to, template, context, subject, ...override } = params;

    const source = fs.readFileSync(
      __dirname + `/templates/email/${template}.hbs`,
      'utf8',
    );
    const compileTemplate = compile(source);
    const mjml = compileTemplate(context);
    const { html } = mjml2html(mjml);

    await this.mailerService.sendMail({
      ...override,
      to,
      subject,
      html,
      from: this.configService.get('MAILER_FROM'),
    });
  }
}
