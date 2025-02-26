import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let mockUserService: Partial<UsersService>;
  let mockJwtService: Partial<JwtService>;
  const user = { id: 1, username: "test" };

  beforeEach(async () => {
    mockUserService = {
      findByUsername: jest.fn().mockImplementation((username: string) => {
        if (username.trim().length <= 3) {
          throw new NotFoundException();
        }
        user.username = username;
        return user;
      }),
    };
    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue("mockToken"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUserService = module.get<UsersService>(UsersService);
    mockJwtService = module.get<JwtService>(JwtService);
  });

  it("should return access token when successful", async () => {
    const bcryptSpy = jest
      .spyOn(bcrypt, "compare")
      .mockResolvedValue(Promise.resolve(true) as never);

    const result = await service.signIn("test", "test");

    expect(result).toEqual({
      access_token: "mockToken",
    });
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      username: "test",
    });
    expect(bcryptSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw not found exception", async () => {
    const result = service.signIn(" ", "passowrd");
    expect(mockUserService.findByUsername).toHaveBeenCalledWith(" ");
    await expect(result).rejects.toThrow(new NotFoundException());
  });

  it("should throw unauthorized exception if password is not a match", async () => {
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    await expect(service.signIn("test", "password")).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
