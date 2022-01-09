import { InjectTwilio, TwilioClient } from 'nestjs-twilio';

import { Injectable } from '@nestjs/common';

import { ConfigService, LoggerService } from '@xyz/core';

interface SendMessage {
  body: string;
  to: string;
  [key: string]: any;
}

@Injectable()
export class SmsRepository {
  constructor(
    @InjectTwilio() private readonly client: TwilioClient,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(SmsRepository.name);
  }

  async sendMessage(params: SendMessage): Promise<void> {
    try {
      this.loggerService.log('SmsRepository#sendMessage - params', {
        params,
      });

      const { to, body, ...override } = params;

      await this.client.messages.create({
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        ...override,
        to,
        body,
      });
    } catch (e) {
      this.loggerService.error('SmsRepository#sendMessage', e);
    }
  }
}
