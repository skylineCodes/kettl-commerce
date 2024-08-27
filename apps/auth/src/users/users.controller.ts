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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileResponseR } from './dto/profile-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Create Account' })
  @ApiResponse({
    status: 200,
    description: 'User created successfully!'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
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
  @ApiTags('Profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch User Profile' })
  @ApiResponse({
    status: 200,
    type: UserProfileResponseR
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: 500,
    description: 'User cart with ID 66c72ef1591afcd4c692706c not found',
  })
  async getUser(@CurrentUser() user: UserDocument, @Res() response: Response) {
    const { password, ...result } = user;

    return response.status(200).json(result);
  }

  @Get('all')
  @ApiTags('Profile')
  @ApiOperation({ summary: 'Update User Profile' })
  @ApiResponse({
    status: 200,
    type: [UserProfileResponseR]
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: 500,
    description: 'User cart with ID 66c72ef1591afcd4c692706c not found',
  })
  async fetchUsers(@Res() response: Response) {
    const userResponse = await this.usersService.fetchAllUsers();

    return response.status(userResponse.status).json(userResponse);
  }

  @Patch('profile')
  @ApiTags('Profile')
  @ApiOperation({ summary: 'Update User Profile' })
  @ApiResponse({
    status: 200,
    description: 'User credentials updated successfully!'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: 500,
    description: 'User cart with ID 66c72ef1591afcd4c692706c not found',
  })
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
  @ApiTags('Forgot Password')
  @ApiOperation({ summary: 'Request Token' })
  @ApiResponse({
    status: 200,
    description: 'Token sent successfully!'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
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
  @ApiTags('Forgot Password')
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully!'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
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
  @ApiTags('Forgot Password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully!'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() response: Response,
  ) {
    const userResponse =
      await this.usersService.sendResetPassword(resetPasswordDto);

    return response.status(userResponse.status).json(userResponse);
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully!'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
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
