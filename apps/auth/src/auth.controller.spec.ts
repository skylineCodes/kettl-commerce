import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDocument, UserR } from './users/models/user.schema';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          }
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user and return the response', async () => {
      const user: any = {
        _id: '668f6accc34945f741c2b1a0',
        email: 'onakoyak+001@gmail.com',
        password: 'password',
      } as any;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response | any;

      const userResponse: any = {
        status: 200,
        message: 'User logged in successfully!',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(userResponse);

      await authController.login(user, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(user, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(userResponse);
    });

    it('should handle errors during login', async () => {
      const user: any = {
        _id: '668f6accc34945f741c2b1a0',
        email: 'onakoyak+001@gmail.com',
        password: 'password',
      } as any;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response | any;

      const error = new Error('Login failed');

      jest.spyOn(authService, 'login').mockRejectedValue(error);

      await authController.login(user, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(user, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
    });
  });

  describe('autenticate', () => {
    it('should authenticate a user and return the data', async () => {
      const data = {
        user: {
          _id: '668f6accc34945f741c2b1a0',
          email: 'onakoyak+001@gmail.com',
          password: 'password',
        },
      };

      const result = await authController.authenticate(data);

      expect(result).toEqual(data.user);
    })
  })
});
