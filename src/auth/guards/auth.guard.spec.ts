import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../services/users.service";
import { AuthGuard } from "./auth.guard";
import { jwtConstants } from "src/constants";
import { RolesEnum } from "src/types/roles.enum";

describe("AuthGuard", () => {
  let authGuard: AuthGuard;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockUserService: jest.Mocked<UsersService>;

  beforeEach(() => {
    mockJwtService = {
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mockUserService = {
      findByPK: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    authGuard = new AuthGuard(mockJwtService, mockUserService);
  });

  it("should be defined", () => {
    expect(authGuard).toBeDefined();
  });

  it("should throw UnauthorizedException if no token is provided", async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should throw UnauthorizedException if token is invalid", async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer invalid-token",
          },
        }),
      }),
    } as ExecutionContext;

    mockJwtService.verifyAsync.mockRejectedValueOnce(
      new Error("Invalid token"),
    );

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should throw UnauthorizedException if user is not found", async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer valid-token",
          },
        }),
      }),
    } as ExecutionContext;

    const payload = { sub: 1 };
    mockJwtService.verifyAsync.mockResolvedValueOnce(payload);
    mockUserService.findByPK.mockResolvedValueOnce(null);

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should allow access and attach user and roles to request if token is valid and user is found", async () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer valid-token",
      },
      user: null,
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const payload = { sub: 1, username: "testuser" };
    const user = {
      userId: "1",
      username: "testuser",
      roles: [{ role: RolesEnum.Admin }, { role: RolesEnum.Owner }],
    };

    mockJwtService.verifyAsync.mockResolvedValueOnce(payload);
    mockUserService.findByPK.mockResolvedValueOnce(user as any);

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual({
      ...payload,
      roles: [RolesEnum.Admin, RolesEnum.Owner],
    });
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith("valid-token", {
      secret: jwtConstants.secret,
    });
    expect(mockUserService.findByPK).toHaveBeenCalledWith(payload.sub);
  });
});
