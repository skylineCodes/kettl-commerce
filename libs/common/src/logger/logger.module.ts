import { Module } from '@nestjs/common';
import * as fs from 'fs';
import { resolve } from 'path'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logPath = resolve('libs/common/src/logger/logs', 'app.log');

console.log(`App log path: ${logPath}`);

const customJsonFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  const log = {
    timestamp: timestamp,
    level: level,
    message: message,
    ...metadata,  // Include any additional metadata like request ID, user info, etc.
  };

  return JSON.stringify(log);
});

@Module({
  imports: [
    // PinoLoggerModule.forRoot({
    //   pinoHttp: {
    //     level: 'info',
    //     transport: {
    //       targets: [
    //         {
    //           level: 'trace',
    //           target: 'pino/file',
    //           options: {
    //             destination: logPath,
    //           },
    //         },
    //         {
    //           level: 'trace',
    //           target: 'pino/file',
    //           options: {
    //             destination: 1,
    //           },
    //         },
    //       ],
    //       options: {
    //         singleLine: true,
    //       },
    //     },
    //   },
    // }),
    WinstonModule.forRoot({
      transports: [
        // Console transport
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.colorize(),
            customJsonFormat
            // winston.format.printf(({ level, message, timestamp }) => {
            //   // return `${timestamp} ${level}: ${message}`;
            //   return {
            //     timestamp,
            //     level,
            //     ...message
            //   }
            // })
          ),
        }),

        // File transport
        new winston.transports.File({
          filename: logPath,
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            customJsonFormat
            // winston.format.printf(({ level, message, timestamp }) => {
            //   return `${timestamp} ${level}: ${message}`;
            // })
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
