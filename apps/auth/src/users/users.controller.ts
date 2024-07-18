import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Res,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument, UserR } from './models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '@app/common';
import { Response } from 'express';
import { RequestTokenDto } from './dto/request-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const userResponse: UserR = await this.usersService.create(
      createUserDto,
      response,
    );

    return response.status(userResponse.status).json(userResponse);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDocument, @Res() response: Response) {
    const { password, ...result } = user;

    return response.status(200).json(result);
  }

  @Get('all')
  async fetchUsers(@Res() response: Response) {
    const userResponse = await this.usersService.fetchAllUsers();

    return response.status(userResponse.status).json(userResponse);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() user: UserDocument,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const userResponse = await this.usersService.updateUser(
      user,
      updateUserDto,
    );

    return response.status(userResponse.status).json(userResponse);
  }

  @Post('request-token')
  async requestToken(
    @Body() requestTokenDto: RequestTokenDto,
    @Res() response: Response,
  ) {
    const userResponse =
      await this.usersService.sendRequestToken(requestTokenDto);

    return response.status(userResponse.status).json(userResponse);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: UserDocument,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() response: Response,
  ) {
    const userResponse = await this.usersService.changePassword(
      changePasswordDto,
      user,
    );

    return response.status(userResponse.status).json(userResponse);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() response: Response,
  ) {
    const userResponse =
      await this.usersService.sendResetPassword(resetPasswordDto);

    return response.status(userResponse.status).json(userResponse);
  }

  @Delete('delete_account')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(
    @CurrentUser() user: UserDocument,
    @Res() response: Response,
  ) {
    const userResponse = await this.usersService.deleteUsers(user);

    return response.status(userResponse.status).json(userResponse);
  }
}
