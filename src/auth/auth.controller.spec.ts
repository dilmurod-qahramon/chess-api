import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { UsersService } from "./services/users.service";
import { JwtService } from "@nestjs/jwt";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { TokensDto } from "./dto/tokens.dto";
import { RolesEnum } from "src/types/roles.enum";
import * as bcrypt from "bcrypt";

describe("AuthController", () => {
  let controller: AuthController;
  let authServiceMock: jest.Mocked<AuthService>;
  let userServiceMock: jest.Mocked<UsersService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    authServiceMock = {
      signIn: jest.fn(),
      generateTokens: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;
    userServiceMock = {
      findByUsername: jest.fn(),
      createNewUser: jest.fn(),
      updateRefreshToken: jest.fn(),
      findByPK: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;
    jwtServiceMock = {
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: UsersService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signIn action tests", () => {
    it("should throw Not Found Exception if user does not exist", async () => {
      userServiceMock.findByUsername.mockResolvedValueOnce(null);
      const result = controller.signIn({} as any);
      await expect(result).rejects.toThrow(
        new NotFoundException("User is not found!"),
      );
      expect(userServiceMock.findByUsername).toHaveBeenCalledTimes(1);
    });

    it("should return tokensDto", async () => {
      const tokensDto = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        roles: [RolesEnum.Admin],
      } as TokensDto;

      userServiceMock.findByUsername.mockResolvedValueOnce({
        username: "test",
        roles: [RolesEnum.Admin],
      } as any);
      authServiceMock.signIn.mockResolvedValueOnce(tokensDto);

      const result = await controller.signIn({
        password: "password",
        username: "test",
      });
      expect(userServiceMock.findByUsername).toHaveBeenCalledTimes(1);
      expect(authServiceMock.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tokensDto);
    });
  });
  describe("register action tests", () => {
    it("should throw bad request exception if username already exists", async () => {
      const user = { username: "test " };
      userServiceMock.findByUsername.mockReturnValueOnce(user as any);
      const result = controller.register(user as any);
      await expect(result).rejects.toThrow(
        new BadRequestException("Username already exists"),
      );
      expect(userServiceMock.findByUsername).toHaveBeenCalledTimes(1);
    });

    it("should return userDto", async () => {
      const userDto = { username: "test ", email: "test@gmail.com", roles: [] };
      userServiceMock.findByUsername.mockResolvedValueOnce(null);
      userServiceMock.createNewUser.mockReturnValueOnce(userDto as any);

      const result = await controller.register(userDto as any);

      expect(userServiceMock.createNewUser).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findByUsername).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userDto);
    });
  });
  describe("refreshToken action tests", () => {
    it("should throw not found exception", async () => {
      jwtServiceMock.verifyAsync.mockResolvedValueOnce({ sub: "id" });
      userServiceMock.findByPK.mockResolvedValueOnce(null);
      const result = controller.refreshToken({} as any);
      await expect(result).rejects.toThrow(
        new NotFoundException("Invalid refresh token payload."),
      );
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findByPK).toHaveBeenCalledTimes(1);
    });

    it("should throw unauthorized exception", async () => {
      const refreshToken = "refresh-token";
      jwtServiceMock.verifyAsync.mockResolvedValueOnce({ sub: "id" });
      userServiceMock.findByPK.mockResolvedValueOnce({
        refreshTokenHash: "refresh-token-hash",
      } as any);
      const bcryptSpy = jest
        .spyOn(bcrypt, "compare")
        .mockResolvedValueOnce(false as never);

      const result = controller.refreshToken({ refreshToken });
      await expect(result).rejects.toThrow(
        new UnauthorizedException("Invalid refresh token"),
      );
      expect(userServiceMock.findByPK).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledTimes(1);
      expect(bcryptSpy).toHaveBeenCalledWith(
        refreshToken,
        "refresh-token-hash",
      );
    });

    it("should throw unauthorized exception", async () => {
      const refreshTokenHash = "refresh-token-hash";
      const tokensDto = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      } as TokensDto;
      jwtServiceMock.verifyAsync.mockResolvedValueOnce({ sub: "id" });
      userServiceMock.findByPK.mockResolvedValueOnce({
        refreshTokenHash,
      } as any);
      authServiceMock.generateTokens.mockResolvedValueOnce([
        tokensDto.accessToken,
        tokensDto.refreshToken,
      ]);
      const bcryptSpy = jest
        .spyOn(bcrypt, "compare")
        .mockResolvedValueOnce(true as never);

      const result = await controller.refreshToken(tokensDto);
      expect(result).toEqual(tokensDto);
      expect(userServiceMock.findByPK).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledTimes(1);
      expect(authServiceMock.generateTokens).toHaveBeenCalledTimes(1);
      expect(userServiceMock.updateRefreshToken).toHaveBeenCalledTimes(1);
      expect(bcryptSpy).toHaveBeenCalledWith(
        tokensDto.refreshToken,
        refreshTokenHash,
      );
    });
  });
});
