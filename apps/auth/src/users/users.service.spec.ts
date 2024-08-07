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
    // it('should create a new user and set auth token', async () => {
    //   const createUserDto: CreateUserDto = {
    //     email: 'onakoyak@gmail.com',
    //     password: 'password',
    //     firstName: 'Korede',
    //     lastName: 'Timothy',
    //     orderHistory: [],
    //     wishlist: [],
    //     cart: [],
    //     isActive: true,
    //     lastLogin: new Date(),
    //     roles:['customer'],
    //   };
    //   const response = {
    //     cookie: jest.fn(),
    //   } as unknown as Response | any;

    //   const hashedPassword: any = 'hashedpassword123';
    //   const createdUser: any = { _id: '68f6accc34945f741c2b1a0', ...createUserDto, password: hashedPassword };

    //   jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
    //   jest.spyOn(usersRepository, 'create').mockResolvedValue(createdUser);
    //   jest.spyOn(usersService, 'setAuthToken').mockResolvedValue();

    //   const result = await usersService.create(createUserDto, response);

    //   expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    //   expect(usersRepository.create).toHaveBeenCalledWith({
    //     ...createUserDto,
    //     password: hashedPassword,
    //     orderHistory: [],
    //     wishlist: [],
    //     cart: [],
    //     isActive: true,
    //     lastLogin: expect.any(Date),
    //     roles: ['customer']
    //   });
    //   expect(usersService.setAuthToken).toHaveBeenCalledWith(createdUser, response);
    //   expect(result).toEqual({ status: 200, message: 'User created successfully!' });
    // });

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

  })
});
