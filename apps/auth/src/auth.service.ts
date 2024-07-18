import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from './users/models/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) {}

  async login(user: UserDocument, response: Response) {
    try {
      await this.usersRepository.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          lastLogin: new Date(),
        },
      );

      await this.usersService.setAuthToken(user, response);

      return {
        status: 200,
        message: 'User logged in successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
