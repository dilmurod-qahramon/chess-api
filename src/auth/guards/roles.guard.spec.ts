import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { RolesEnum } from "src/types/roles.enum";

describe("RolesGuard", () => {
  function createMockContext(user: { roles: RolesEnum[] }): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: user,
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;
  }

  it("should be defined", () => {
    const mockReflector = {} as Reflector;
    const guard = new RolesGuard(mockReflector);
    expect(guard).toBeDefined();
  });

  it("should allow access when no roles are required (empty array)", () => {
    const mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue([]),
    };
    const guard = new RolesGuard(mockReflector as any);
    const context = createMockContext({ roles: [RolesEnum.Owner] });
    expect(guard.canActivate(context)).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it("should allow access when user has required role", () => {
    const requiredRoles = [RolesEnum.Admin];
    const mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredRoles),
    };
    const guard = new RolesGuard(mockReflector as any);
    const context = createMockContext({ roles: requiredRoles });
    expect(guard.canActivate(context)).toBe(true);
  });

  it("should deny access when user has none of the required roles", () => {
    const requiredRoles = [RolesEnum.Admin, RolesEnum.Moderator];
    const mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredRoles),
    };
    const guard = new RolesGuard(mockReflector as any);
    const context = createMockContext({ roles: [RolesEnum.Owner] });
    expect(guard.canActivate(context)).toBe(false);
  });
});
