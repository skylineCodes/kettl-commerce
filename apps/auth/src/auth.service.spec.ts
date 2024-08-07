import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service"
import { UsersRepository } from "./users/users.repository";
import { UsersService } from "./users/users.service";
import { UserDocument } from "./users/models/user.schema";


describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findOneAndUpdate: jest.fn()
          },
        },
        {
          provide: UsersService,
          useValue: {
            setAuthToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user and set the auth token', async () => {
      const user: any = {
        _id: '668f6accc34945f741c2b1a0',
        email: 'onakoyak+001@gmail.com',
        password: 'password',
        lastLogin: new Date(),
      } as any;

      const response = {} as Response | any;
      response.cookie = jest.fn();

      const mockLastLoginDate = new Date();

      jest.spyOn(usersRepository, 'findOneAndUpdate').mockResolvedValue(user);
      jest.spyOn(usersService, 'setAuthToken').mockResolvedValue();

      const result = await authService.login(user, response);

      expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: user._id },
        { lastLogin: expect.any(Date) },
      );
      const lastLoginArg = (usersRepository.findOneAndUpdate as jest.Mock).mock.calls[0][1].lastLogin;
      expect(lastLoginArg.getTime()).toBeCloseTo(mockLastLoginDate.getTime(), -1);

      expect(usersService.setAuthToken).toHaveBeenCalledWith(user, response);
      expect(result).toEqual({
        status: 200,
        message: 'User logged in successfully!',
      });
    });

    it('should throw an error if login fails', async () => {
      const user: any = {
        _id: '668f6accc34945f741c2b1a0',
        email: 'test"gmail.com',
        password: 'password',
        lastLogin: new Date(),
      } as any;
      const response = {} as Response | any;

      jest.spyOn(usersRepository, 'findOneAndUpdate').mockRejectedValue(new Error('Login failed'));

      await expect(authService.login(user, response)).rejects.toThrow('Login failed');
      expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: user._id },
        { lastLogin: expect.any(Date) },
      );
      expect(usersService.setAuthToken).not.toHaveBeenCalled();
    });
  });
})