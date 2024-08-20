import { Module } from '@nestjs/common';
import * as fs from 'fs';
import { resolve } from 'path'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

const logPath = resolve('libs/common/src/logger/logs', 'app.log');

console.log(`App log path: ${logPath}`);

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          targets: [
            {
              level: 'trace',
              target: 'pino/file',
              options: {
                destination: logPath,
              },
            },
            {
              level: 'trace',
              target: 'pino/file',
              options: {
                destination: 1,
              },
            },
          ],
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
