import dotenv from 'dotenv';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: `.env`,
    });

    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  isEnv(env: string) {
    return this.get('NODE_ENV') === env;
  }
}
