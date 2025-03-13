import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PlayerService } from "./services/player.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PlayerController } from "./player.controller";
import * as request from "supertest";
import { AuthGuard } from "src/auth/guards/auth.guard";

describe("Player", () => {
  let app: INestApplication;
  let playerService: PlayerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            findOrCreatePlayer: jest.fn(),
            findPlayerByUsername: jest.fn(),
            findByUsername: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    playerService = moduleFixture.get<PlayerService>(PlayerService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/POST players", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw bad request exception if username is invalud", async () => {
      const response = await request(app.getHttpServer())
        .post("/players/abc")
        .send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Username cannot be empty or less than 5 characters.",
      );
    });

    it("should return a valid player if username is correct", async () => {
      const mockPlayer = { id: 1, username: "validUser" };
      jest
        .spyOn(playerService, "findOrCreatePlayer")
        .mockResolvedValue([{ dataValues: mockPlayer }] as any);

      const response = await request(app.getHttpServer())
        .post("/players/validUser")
        .send();

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockPlayer);
      expect(playerService.findOrCreatePlayer).toHaveBeenCalledWith(
        mockPlayer.username,
      );
    });
  });

  describe("/GET players", () => {
    it("should throw not found exception if username is invalud", async () => {
      jest.spyOn(playerService, "findByUsername").mockResolvedValueOnce(null);
      const response = await request(app.getHttpServer())
        .get("/players/abc")
        .send();

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        `Player with username "abc" is not found.`,
      );
      expect(playerService.findByUsername).toHaveBeenCalledWith("abc");
    });

    it("should return a valid player if username is correct", async () => {
      jest.spyOn(playerService, "findByUsername").mockResolvedValueOnce({
        dataValues: { id: "1", username: "test" },
      } as any);
      const response = await request(app.getHttpServer())
        .get("/players/test")
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ id: "1", username: "test" });
      expect(playerService.findByUsername).toHaveBeenCalledWith("test");
    });
  });
});
