import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { UserDocument } from './models/user.schema';
import { Types } from 'mongoose';
import { RequestTokenDto } from './dto/request-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let jwtService: JwtService;
  let configService: ConfigService;
  let notificationsService: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: NOTIFICATIONS_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    notificationsService = module.get<ClientProxy>(NOTIFICATIONS_SERVICE);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and set auth token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'onakoyak@gmail.com',
        password: 'password',
        firstName: 'Korede',
        lastName: 'Timothy',
        orderHistory: [],
        wishlist: [],
        cart: [],
        isActive: true,
        roles: ['customer'],
      };

      const mockUserDocument: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email: 'newuser@gmail.com',
        password: await bcrypt.hash(createUserDto.password, 10),
        firstName: 'Korede',
        lastName: 'Timothy',
        orderHistory: [],
        wishlist: [],
        cart: [],
        isActive: true,
        lastLogin: new Date(),
        roles: ['customer'],
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserDocument;

      const mockResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response | any;

      // Mock the validateCreateUserDto to do nothing
      jest
        .spyOn(usersService as any, 'validateCreateUserDto')
        .mockResolvedValue(undefined);

      // Mock the usersRepository.create method to return a user document
      jest.spyOn(usersRepository, 'create').mockResolvedValue(mockUserDocument);

      const mockJwtToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjhmNmFjY2MzNDk0NWY3NDFjMmIxYTAiLCJpYXQiOjE1MTYyMzkwMjJ9.4R9EkjhTYVJKd8l1JnHFrKZ5bXlYtx_e-C4RZ5m-LqA';

      // Mock the jwtService.sign method
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken);

      // Mock the configService.get method to return a specific JWT expiration
      jest.spyOn(configService, 'get').mockReturnValue(3600);

      // Mock the setAuthToken method
      // jest.spyOn(usersService, 'setAuthToken').mockResolvedValue(undefined);

      const result = await usersService.create(createUserDto, mockResponse);

      expect(usersService['validateCreateUserDto']).toHaveBeenCalledWith(
        createUserDto,
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
        orderHistory: [],
        wishlist: [],
        cart: [],
        isActive: true,
        lastLogin: expect.any(Date),
        roles: ['customer'],
      });
      
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'Authentication',
        mockJwtToken,
        expect.any(Object),
      );
      expect(result).toEqual({
        status: 200,
        message: 'User created successfully!',
      });
    });

    it('should handle existing email error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'onakoyak@gmail.com',
        password: 'password',
        firstName: 'Korede',
        lastName: 'Timothy',
        orderHistory: [],
        wishlist: [],
        cart: [],
        isActive: true,
        roles: [],
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
        _id: '668f6accc34945f741c2b1a0',
        email: 'onakoyak+001@gmail.com',
        firstName: 'Onakoye',
        lastName: 'Korede',
        phoneNumber: '09066432526',
        address: {
          street: 'No 10, Kolade estate, Gof area.',
          city: 'Osogbo',
          state: 'Osun',
          postalCode: '10011',
          country: 'Nigeria',
        },
        roles: ['customer'],
        orderHistory: [],
        wishlist: [],
        cart: [],
        isActive: true,
        lastLogin: new Date('2024-08-06T18:36:59.664Z'),
        createdAt: new Date('2024-07-11T05:17:00.653Z'),
        updatedAt: new Date('2024-08-06T18:36:59.674Z'),
      } as any);

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response | any;

      await expect(
        usersService.create(createUserDto, mockResponse),
      ).rejects.toThrow(
        new UnprocessableEntityException('Email already exists.'),
      );
    });
  });

  describe('setAuthToken', () => {
    it('should set auth token in response', async () => {
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
      } as UserDocument;

      const response = {
        cookie: jest.fn(),
      } as unknown as Response | any;

      const tokenPayload = {
        userId: user._id.toHexString()
      }
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + 3600);
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjhmNmFjY2MzNDk0NWY3NDFjMmIxYTAiLCJpYXQiOjE1MTYyMzkwMjJ9.4R9EkjhTYVJKd8l1JnHFrKZ5bXlYtx_e-C4RZ5m-LqA';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      jest.spyOn(configService, 'get').mockReturnValue('3600');

      await usersService.setAuthToken(user, response);

      expect(jwtService.sign).toHaveBeenCalledWith(tokenPayload);
      expect(response.cookie).toHaveBeenCalledWith('Authentication', token, {
        httpOnly: true,
        expires: expect.any(Date),
      })
    })
  });

  describe('verifyUser', () => {
    it('should verify user credentials', async () => {
      const email = 'onakoyak+001@gmail.com';
      const password = 'Password@2020';
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email,
        password: 'hashedpassword123',
      } as UserDocument;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await usersService.verifyUser(email, password);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const email = 'onakoyak+001@gmail.com';
      const password = 'Password@200';
      
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email,
        password: 'hashedpassword123',
      } as UserDocument;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(usersService.verifyUser(email, password)).rejects.toThrow(
        new UnauthorizedException('Credentials are not valid.'),
      );
    });
  });

  describe('sendRequestToken', () => {
    it('should send request token to user', async () => {
      const requestTokenDto: RequestTokenDto = { email: 'onakoyak+001@gmail.com' };
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email: 'onakoyak+001@gmail.com',
      } as UserDocument;
      const resetToken = expect.any(String);

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'findOneAndUpdate').mockResolvedValue(user);
      jest.spyOn(Math, 'random').mockReturnValue(0.123456);
      jest.spyOn(notificationsService, 'emit').mockReturnThis();

      const result = await usersService.sendRequestToken(requestTokenDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ email: requestTokenDto.email });
      expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(user._id, {
        ...user,
        resetPasswordToken: resetToken,
        resetPasswordExpires: expect.any(Date),
      });
      expect(notificationsService.emit).toHaveBeenCalledWith('notify_email', expect.any(Object));
      expect(result).toEqual({ status: 200, message: 'Token sent successfully!' });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const requestTokenDto: RequestTokenDto =  { email: 'onakoyek@gmail.com' };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.sendRequestToken(requestTokenDto)).rejects.toThrow(
        new UnauthorizedException('Email is not valid.')
      );
    });
  });

  describe('sendResetPassword', () => {
    it('should reset user password', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        code: '123456',
        current_password: 'Password@2020',
        new_password: 'Password@2021'
      };

      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        password: 'password',
      } as UserDocument;

      const hashedPassword = 'hashedpassword123';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(usersRepository, 'findOneAndUpdate').mockResolvedValue(user);

      const result = await usersService.sendResetPassword(resetPasswordDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ resetPasswordToken: resetPasswordDto.code });
      expect(bcrypt.compare).toHaveBeenCalledWith(resetPasswordDto.current_password, user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(resetPasswordDto.new_password, 10);
      expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(user._id, { ...user, password: hashedPassword });
      expect(result).toEqual({ status: 200, message: 'Password updated successfully!' });
    });

    it('should throw UnauthorizedException for invalid code', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        code: 'invalidCode',
        current_password: 'Password@2020',
        new_password: 'Password@2021',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.sendResetPassword(resetPasswordDto)).rejects.toThrow(
        new UnauthorizedException('Code is invalid.'),
      );
    });

    it('should throw UnauthorizedException for invalid current password', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        code: '123456',
        current_password: 'invalidpassword',
        new_password: 'Password@2021',
      };

      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        password: 'password',
      } as UserDocument;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(usersService.sendResetPassword(resetPasswordDto)).rejects.toThrow(
        new UnauthorizedException('Current password is invalid.'),
      );
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const changePasswordDto: ChangePasswordDto = {
        current_password: 'Password@2020',
        new_password: 'Password@2021',
      };
      
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        password: 'password',
      } as UserDocument;

      const hashedPassword = 'hashedpassword123';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(usersRepository, 'findOneAndUpdate').mockResolvedValue(user);

      const result = await usersService.changePassword(changePasswordDto, user);

      expect(bcrypt.compare).toHaveBeenCalledWith(changePasswordDto.current_password, user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(changePasswordDto.new_password, 10);
      expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(user._id, { ...user, password: hashedPassword });
      expect(result).toEqual({ status: 200, message: 'Password changed successfully!' });
    });

    it('should throw UnauthorizedException for invalid current password', async () => {
      const changePasswordDto: ChangePasswordDto = {
        current_password: 'invalidpassword',
        new_password: 'Password@2021',
      };

      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        password: 'password',
      } as UserDocument;

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(usersService.changePassword(changePasswordDto, user)).rejects.toThrow(
        new UnauthorizedException('Current password is invalid.'),
      );
    });
  });

  describe('getUser', () => {
    it('should get a user', async () => {
      const getUserDto: GetUserDto = {
        _id: '668f6accc34945f741c2b1a0',
      };

      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email: 'onakoyak+001@gmail.com',
      } as UserDocument;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.getUser(getUserDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith(getUserDto);
      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update user credentials', async () => {
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email: 'onakoyak+001@gmail.com',
      } as UserDocument;

      const updateUserDto: UpdateUserDto = { email: 'onakoyak+002@gmail.com' };
      const updatedUser: UserDocument = {
        ...user,
        ...updateUserDto,
      } as UserDocument;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(usersRepository, 'findOneAndUpdate')
        .mockResolvedValue(updatedUser);

      const result = await usersService.updateUser(user, updateUserDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith(user._id);
      expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        user._id,
        updateUserDto,
      );
      expect(result).toEqual({
        status: 200,
        message: 'User credentials updated successfully!',
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      const user: UserDocument = {
        _id: new Types.ObjectId('668f6accc34945f741c2b1a0'),
        email: 'onakoyak+001@gmail.com',
      } as UserDocument;

      const updateUserDto: UpdateUserDto = { email: 'onakoyek+001@gmail.com' };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(
        usersService.updateUser(user, updateUserDto),
      ).rejects.toThrow(new UnauthorizedException('Credentials not found!'));
    });
  });
});
