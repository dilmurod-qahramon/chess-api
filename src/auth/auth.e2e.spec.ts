import {
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TokensDto } from "./dto/tokens.dto";
import { AuthController } from "./auth.controller";
import { UsersService } from "./services/users.service";
import { AuthService } from "./services/auth.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto } from "./dto/register-user.dto";
import * as bcrypt from "bcrypt";
import * as request from "supertest";

describe("Auth", () => {
  let app: INestApplication;
  let userService: UsersService;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            findByPK: jest.fn(),
            createNewUser: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            generateTokens: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    userService = moduleFixture.get<UsersService>(UsersService);
    authService = moduleFixture.get<AuthService>(AuthService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/POST auth/login", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw not found exception", async () => {
      const loginDto = { username: "test user", password: "password" };
      jest.spyOn(userService, "findByUsername").mockResolvedValueOnce(null);
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send(loginDto)
        .expect(404);

      expect(response.notFound).toEqual(true);
      expect(response.body.message).toEqual("User is not found!");
      expect(userService.findByUsername).toHaveBeenCalledTimes(1);
    });

    it("should return tokens on succcessful login", async () => {
      const loginDto = { username: "test user", password: "password" };
      const tokens = new TokensDto({
        accessToken: "mocked-access-token",
        refreshToken: "mocked-refresh-token",
      });

      jest.spyOn(userService, "findByUsername").mockResolvedValueOnce({
        username: loginDto.username,
        userId: "1",
        roles: [],
      } as any);
      jest.spyOn(authService, "signIn").mockResolvedValueOnce(tokens);

      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send(loginDto)
        .expect(201);

      expect(response.body).toEqual(tokens);
      expect(userService.findByUsername).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("/POST auth/register", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw bad request exception if username is missing", async () => {
      const registerDto: RegisterUserDto = {
        username: "",
        email: "test@gmail.com",
        password: "password",
      };

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(registerDto)
        .expect(400);

      expect(response.badRequest).toBeTruthy();
      expect(response.body.message).toEqual([
        "Username cannot be empty",
        "Minimum required length is 5 characters",
      ]);
    });

    it("should throw bad request exception if email is invalid", async () => {
      const registerDto: RegisterUserDto = {
        username: "username",
        email: "invalid email",
        password: "password",
      };

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(registerDto)
        .expect(400);

      expect(response.badRequest).toBeTruthy();
      expect(response.body.message).toEqual(["Invalid email format"]);
    });

    it("should throw bad request exception if user exists", async () => {
      const registerDto: RegisterUserDto = {
        username: "new user",
        email: "test@gmail.com",
        password: "password",
      };

      jest
        .spyOn(userService, "findByUsername")
        .mockResolvedValueOnce({} as any);

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(registerDto)
        .expect(400);

      expect(response.badRequest).toBeTruthy();
      expect(response.body.message).toEqual("Username already exists");
      expect(userService.findByUsername).toHaveBeenCalledTimes(1);
    });

    it("should return userDto on succcessful registeration", async () => {
      const registerDto: RegisterUserDto = {
        username: "new user",
        email: "test@gmail.com",
        password: "password",
      };

      jest.spyOn(userService, "findByUsername").mockResolvedValueOnce(null);
      jest
        .spyOn(userService, "createNewUser")
        .mockResolvedValue({ username: "newUser" } as any);

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual({ username: "newUser" });
      expect(userService.findByUsername).toHaveBeenCalledTimes(1);
      expect(userService.createNewUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("/POST auth/refresh-token", () => {
    const refreshToken = "some-token";
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw unauthorized exception if refresh-token is expired.", async () => {
      jest
        .spyOn(jwtService, "verifyAsync")
        .mockRejectedValueOnce(new UnauthorizedException());

      const response = await request(app.getHttpServer())
        .post("/auth/refresh-token")
        .send({ refreshToken })
        .expect(401);

      expect(response.unauthorized).toBeTruthy();
      expect(response.body.message).toEqual("Invalid token!");
      expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
    });

    it("should throw not found exception if user is not found.", async () => {
      jest.spyOn(jwtService, "verifyAsync").mockResolvedValueOnce({} as any);
      jest.spyOn(userService, "findByPK").mockResolvedValueOnce(null);
      const response = await request(app.getHttpServer())
        .post("/auth/refresh-token")
        .send({ refreshToken })
        .expect(404);

      expect(response.notFound).toBeTruthy();
      expect(response.body.message).toEqual("Invalid refresh token payload.");
      expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(userService.findByPK).toHaveBeenCalledTimes(1);
    });

    it("should throw unauthorized exception if refresh-token and its hash are not the same", async () => {
      jest.spyOn(jwtService, "verifyAsync").mockResolvedValueOnce({} as any);
      jest.spyOn(userService, "findByPK").mockResolvedValueOnce({} as any);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);

      const response = await request(app.getHttpServer())
        .post("/auth/refresh-token")
        .send({ refreshToken })
        .expect(401);

      expect(response.unauthorized).toBeTruthy();
      expect(response.body.message).toEqual("Invalid refresh token");
      expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(userService.findByPK).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it("should return new tokens if successful", async () => {
      const tokens = new TokensDto({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
      jest.spyOn(jwtService, "verifyAsync").mockResolvedValueOnce({} as any);
      jest.spyOn(userService, "findByPK").mockResolvedValueOnce({} as any);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);
      jest
        .spyOn(authService, "generateTokens")
        .mockResolvedValueOnce([tokens.accessToken, tokens.refreshToken]);

      const response = await request(app.getHttpServer())
        .post("/auth/refresh-token")
        .send({ refreshToken })
        .expect(201);

      expect(response.body).toEqual(tokens);
      expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(userService.findByPK).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(authService.generateTokens).toHaveBeenCalledTimes(1);
    });
  });
});
