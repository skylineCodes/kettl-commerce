import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard, NOTIFICATIONS_SERVICE } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './models/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestTokenDto } from './dto/request-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersRepository: UsersRepository;
  let service: UsersService;

  type MockResponse = {
    status: jest.MockedFunction<(code: number) => MockResponse>;
    json: jest.MockedFunction<(body?: any) => MockResponse>;
    cookie: jest.MockedFunction<
      (name: string, value: string, options: object) => MockResponse
    >;
  };

  let mockResponse: MockResponse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: NOTIFICATIONS_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return the response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'onakoyak@gmail.com',
        password: 'password',
        firstName: 'Onakoya',
        lastName: 'Luqman',
        orderHistory: [],
        wishlist: [],
        cart: [],
        isActive: true,
        lastLogin: new Date(),
        roles: ['customer'],
      };

      const userResponse = {
        status: 200,
        message: 'User created successfully!'
      }

      jest.spyOn(service, 'create').mockResolvedValue(userResponse);

      await controller.createUser(createUserDto, mockResponse as Response | any);

      expect(service.create).toHaveBeenCalledWith(createUserDto, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });
  });

  describe('getUser', () => {
    it('should return the user profile', async () => {
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email: 'onakoyak@gmail.com',
        firstName: 'Onakoya',
        lastName: 'Korede',
        password: 'hashedPassword',
        orderHistory: [],
        wishlist: [],
        cart: [],
        isActive: true,
        lastLogin: new Date(),
        roles: ['customer'],
      } as UserDocument;

      await controller.getUser(user, mockResponse as Response | any);

      const { password, ...result } = user;

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });
  });

  describe('fetchUsers', () => {
    it('should return all users', async () => {
      const userResponse = {
        status: 200,
        data: [
          { email: 'larry@gmail.com' },
          { email: 'benji@gmail.com' },
        ],
      };

      jest.spyOn(service, 'fetchAllUsers').mockResolvedValue(userResponse as never);

      await controller.fetchUsers(mockResponse as Response | any);

      expect(service.fetchAllUsers).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });
  });

  describe('updateUser', () => {
    it('should update the user profile', async () => {
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
      } as UserDocument;

      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated'
      };

      const userResponse = {
        status: 200,
        message: 'User updated successfully!',
      };

      jest.spyOn(service, 'updateUser').mockResolvedValue(userResponse as never);

      await controller.updateUser(user, updateUserDto, mockResponse as Response | any);

      expect(service.updateUser).toHaveBeenCalledWith(user, updateUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });
  })
  
  describe('requestToken', () => {
    it('should send a request token', async () => {
      const requestTokenDto: RequestTokenDto = {
        email: 'onakoyak@gmail.com'
      };

      const userResponse = {
        status: 200,
        message: 'Token sent successfully!',
      };

      jest.spyOn(service, 'sendRequestToken').mockResolvedValue(userResponse as never);

      await controller.requestToken(
        requestTokenDto,
        mockResponse as Response | any,
      );

      expect(service.sendRequestToken).toHaveBeenCalledWith(
        requestTokenDto
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
       const user: UserDocument = {
         _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
       } as UserDocument;

      const changePasswordDto: ChangePasswordDto = {
        current_password: 'Password@2020',
        new_password: 'Password@2021',
      };

      const userResponse = {
        status: 200,
        message: 'Token sent successfully!',
      };

      jest
        .spyOn(service, 'changePassword')
        .mockResolvedValue(userResponse as never);

      await controller.changePassword(
        user, changePasswordDto, mockResponse as Response | any,
      );

      expect(service.changePassword).toHaveBeenCalledWith(changePasswordDto, user);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset the user password', async () => {
       const user: UserDocument = {
         _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
       } as UserDocument;

      const resetPasswordDto: ResetPasswordDto = {
        code: '123456',
        current_password: 'Password@2020',
        new_password: 'Password@2021',
      };

      const userResponse = {
        status: 200,
        message: 'Password reset successfully!',
      };

      jest
        .spyOn(service, 'sendResetPassword')
        .mockResolvedValue(userResponse as never);

      await controller.resetPassword(
        resetPasswordDto,
        mockResponse as Response | any,
      );

      expect(service.sendResetPassword).toHaveBeenCalledWith(
        resetPasswordDto
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });
  });

  describe('deleteAccount', () => {
    it('should delete the user account', async () => {
       const user: UserDocument = {
         _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
       } as UserDocument;

      const userResponse = {
        status: 200,
        message: 'User deleted successfully!',
      };

      jest
        .spyOn(service, 'deleteUsers')
        .mockResolvedValue(userResponse as never);

      await controller.deleteAccount(
        user,
        mockResponse as Response | any,
      );

      expect(service.deleteUsers).toHaveBeenCalledWith(user);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });
  });
});
