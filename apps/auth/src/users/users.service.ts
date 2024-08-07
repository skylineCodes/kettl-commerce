import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument, UserR } from './models/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RequestTokenDto } from './dto/request-token.dto';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    response: Response,
  ): Promise<UserR> {
    try {
      await this.validateCreateUserDto(createUserDto);

      const user = await this.usersRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
        orderHistory: createUserDto.orderHistory ?? [],
        wishlist: createUserDto.wishlist ?? [],
        cart: createUserDto.cart ?? [],
        isActive: createUserDto.isActive ?? true,
        lastLogin: new Date(),
        roles: createUserDto.roles ?? ['customer'],
      });

      await this.setAuthToken(user, response);

      return {
        status: 200,
        message: 'User created successfully!',
      };
    } catch (error) {
      if (error.code === '11000') {
        return {
          status: 500,
          message: error.message,
        };
      }

      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async setAuthToken(
    user: UserDocument,
    response: Response | any,
  ): Promise<void> {
    try {
      const tokenPayload = {
        userId: user._id.toHexString(),
      };

      const expires = new Date();
      expires.setSeconds(
        expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
      );

      const token = this.jwtService.sign(tokenPayload);

      return response.cookie('Authentication', token, {
        httpOnly: true,
        expires,
      });
    } catch (error) {
      throw error;
    }
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      const res = await this.usersRepository.findOne({
        email: createUserDto.email,
      });

      // console.log(res);

      if (res !== null) throw new UnprocessableEntityException('Email already exists.');

      return;
    } catch (err) {
      throw err;
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  // Send otp code to user
  async sendRequestToken(resetPasswordDto: RequestTokenDto): Promise<UserR> {
    // Check if the email is valid and get the user
    const user = await this.usersRepository.findOne({
      email: resetPasswordDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Email is not valid.');
    }

    // Generate a random six-digit OTP
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the token and its expiration to the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await this.usersRepository.findOneAndUpdate(user._id, user);

    const mailOptions = {
      email: resetPasswordDto.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please use the following OTP to complete the process within one hour of receiving it:
      OTP: ${resetToken}
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    try {
      // await transporter.sendMail(mailOptions);
      this.notificationsService.emit('notify_email', mailOptions);

      return {
        status: 200,
        message: 'Token sent successfully!',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email.');
    }
  }

  // Reset user password
  async sendResetPassword(resetPasswordDto: ResetPasswordDto): Promise<UserR> {
    // Check if the email is valid and get the user
    const user = await this.usersRepository.findOne({
      resetPasswordToken: resetPasswordDto.code,
    });

    if (!user) {
      throw new UnauthorizedException('Code is invalid.');
    }

    // Verify the old password is valid
    const passwordIsValid = await bcrypt.compare(
      resetPasswordDto.current_password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Current password is invalid.');
    }

    // Update the new password
    user.password = await bcrypt.hash(resetPasswordDto.new_password, 10);

    await this.usersRepository.findOneAndUpdate(user._id, user);

    // return success response
    return {
      status: 200,
      message: 'Password updated successfully!',
    };
  }

  // Update password while logged in
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: UserDocument,
  ) {
    // Verify the old password is valid
    const passwordIsValid = await bcrypt.compare(
      changePasswordDto.current_password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Current password is invalid.');
    }

    // Update the new password
    user.password = await bcrypt.hash(changePasswordDto.new_password, 10);

    await this.usersRepository.findOneAndUpdate(user._id, user);

    // return success response
    return {
      status: 200,
      message: 'Password changed successfully!',
    };
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async updateUser(user: UserDocument, updateUserDto: UpdateUserDto) {
    try {
      const userRes = await this.usersRepository.findOne(user?._id);

      if (!userRes) {
        throw new UnauthorizedException('Credentials not found!');
      }

      await this.usersRepository.findOneAndUpdate(user?._id, updateUserDto);

      return {
        status: 200,
        message: 'User credentials updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchAllUsers() {
    try {
      const userRes = await this.usersRepository.find();

      return {
        status: 200,
        data: userRes,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUsers(user: UserDocument) {
    try {
      const userRes = await this.usersRepository.findOneAndDelete(user?._id);

      if (!userRes) {
        throw new UnauthorizedException('Credentials not found!');
      }

      return {
        status: 200,
        message: 'User account deleted successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
