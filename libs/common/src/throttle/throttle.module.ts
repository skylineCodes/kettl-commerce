import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60, // Time-to-live for each request record in seconds
      limit: 10, // Maximum number of requests per ttl window
    }]),
  ],
})

export class ThrottleModule {}
