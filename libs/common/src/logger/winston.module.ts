import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLogger extends ConsoleLogger {
  private readonly logger: winston.Logger;

  constructor(context?: string) {
    super(context);

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.Http({
          host: 'localhost',
          port: 9200,
          path: '/_bulk',
        //   auth: { username: 'elastic', password: 'your-password' },
        }),
      ],
    });
  }

  log(message: any, context?: string) {
    const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
    this.logger.info({ message: logMessage });
  }

  error(message: any, trace?: string, context?: string) {
    const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
    this.logger.error({ message: logMessage });
  }

  warn(message: any, context?: string) {
    const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
    this.logger.warn({ message: logMessage });
  }
}
