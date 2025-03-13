import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let mockUserService: jest.Mocked<UsersService>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    mockUserService = {
      updateRefreshToken: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<UsersService>;
    mockJwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should return tokens when successful", async () => {
    const bcryptSpy = jest
      .spyOn(bcrypt, "compare")
      .mockResolvedValue(Promise.resolve(true) as never);
    const generateTokens = jest
      .spyOn(service, "generateTokens")
      .mockResolvedValue(["accessToken", "refreshToken"]);
    const updateRefreshToken = jest.spyOn(
      mockUserService,
      "updateRefreshToken",
    );
    const result = await service.signIn("password", {} as any);

    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      roles: [],
    });
    expect(bcryptSpy).toHaveBeenCalledTimes(1);
    expect(generateTokens).toHaveBeenCalledTimes(1);
    expect(updateRefreshToken).toHaveBeenCalledTimes(1);
  });

  it("should throw unauthorized exception if password is not a match", async () => {
    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);

    await expect(service.signIn("password", {} as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should generate tokens correctly", async () => {
    const jwtSpy = jest
      .spyOn(mockJwtService, "signAsync")
      .mockResolvedValueOnce("refreshtoken")
      .mockResolvedValueOnce("accesstoken");

    const result = await service.generateTokens({
      userId: "1",
      username: "test",
    } as any);

    expect(jwtSpy).toHaveBeenCalledWith({ sub: "1" }, { expiresIn: "7d" });
    expect(jwtSpy).toHaveBeenCalledWith(
      { sub: "1", username: "test" },
      { expiresIn: "10h" },
    );
    expect(result).toEqual(["accesstoken", "refreshtoken"]);
  });
});
