import { INestApplication, ValidationPipe } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./services/session.service";
import { PlayerService } from "src/player/services/player.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import * as request from "supertest";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { SessionDto } from "./dto/session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { MoveAction } from "src/types/GameTurnAction.type";

describe("Sessions", () => {
  let app: INestApplication;
  let sessionService: SessionService;
  let playerService: PlayerService;
  let authGuardMock: { canActivate: jest.Mock };
  let rolesGuardMock: { canActivate: jest.Mock };

  beforeAll(async () => {
    authGuardMock = {
      canActivate: jest.fn(() => true),
    };
    rolesGuardMock = {
      canActivate: jest.fn(() => true),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            findByPlayerId: jest.fn(),
          },
        },
        {
          provide: SessionService,
          useValue: {
            findBySessionId: jest.fn(),
            createNewSession: jest.fn(),
            addNewActionsToTheSession: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    playerService = moduleFixture.get<PlayerService>(PlayerService);
    sessionService = moduleFixture.get<SessionService>(SessionService);
  });

  describe("Controller level AuthGuard", () => {
    it("should throw forbidden exception if token is invalid", async () => {
      authGuardMock.canActivate.mockResolvedValueOnce(false);
      const response = await request(app.getHttpServer())
        .get("/sessions/abc")
        .send();

      expect(response.status).toEqual(403);
      expect(response.body.message).toBe("Forbidden resource");
      expect(authGuardMock.canActivate).toHaveBeenCalledTimes(1);
    });
  });

  describe("/GET sessions", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw forbidden exception if role is invalid", async () => {
      jest.spyOn(rolesGuardMock, "canActivate").mockResolvedValueOnce(false);
      const response = await request(app.getHttpServer())
        .get("/sessions/invalid-id")
        .send();

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden resource");
      expect(rolesGuardMock.canActivate).toHaveBeenCalledTimes(1);
    });

    it("should throw not found exception if session id is invalid", async () => {
      jest.spyOn(sessionService, "findBySessionId").mockResolvedValueOnce(null);
      const response = await request(app.getHttpServer())
        .get("/sessions/invalid-id")
        .send();

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Invalid session id!");
      expect(sessionService.findBySessionId).toHaveBeenCalledWith("invalid-id");
    });

    it("should throw bad request exception if session is completed", async () => {
      jest.spyOn(sessionService, "findBySessionId").mockResolvedValueOnce({
        completedAt: new Date(),
      } as any);
      const response = await request(app.getHttpServer())
        .get("/sessions/session-id")
        .send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Session is already over!");
      expect(sessionService.findBySessionId).toHaveBeenCalledWith("session-id");
    });

    it("should return sessionDto on success", async () => {
      const dto = new SessionDto({
        id: "1",
        completedAt: undefined,
      });
      jest
        .spyOn(sessionService, "findBySessionId")
        .mockResolvedValueOnce({ dataValues: dto } as any);

      const response = await request(app.getHttpServer())
        .get("/sessions/session-id")
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dto);
      expect(sessionService.findBySessionId).toHaveBeenCalledWith("session-id");
    });
  });

  describe("/POST sessions", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw forbidden exception if role is invalid", async () => {
      jest.spyOn(rolesGuardMock, "canActivate").mockResolvedValueOnce(false);
      const response = await request(app.getHttpServer())
        .post("/sessions")
        .send();

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden resource");
      expect(rolesGuardMock.canActivate).toHaveBeenCalledTimes(1);
    });

    it("should throw bad request if players are the same.", async () => {
      const sessionDto = { leftPlayerId: "1", rightPlayerId: "1" };
      jest.spyOn(playerService, "findByPlayerId").mockResolvedValue({} as any);
      const response = await request(app.getHttpServer())
        .post("/sessions")
        .send(sessionDto);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual("Invalid player id!");
      expect(playerService.findByPlayerId).toHaveBeenCalledTimes(2);
    });

    it("should return session id on success", async () => {
      const sessionDto = { leftPlayerId: "1", rightPlayerId: "2" };
      jest.spyOn(playerService, "findByPlayerId").mockResolvedValue({} as any);
      jest
        .spyOn(sessionService, "createNewSession")
        .mockResolvedValueOnce("new id");
      const response = await request(app.getHttpServer())
        .post("/sessions")
        .send(sessionDto)
        .expect(201);

      expect(response.status).toBe(201);
      expect(playerService.findByPlayerId).toHaveBeenCalledTimes(2);
      expect(sessionService.createNewSession).toHaveBeenCalledTimes(1);
      expect(sessionService.createNewSession).toHaveBeenCalledWith(sessionDto);
    });
  });

  describe("/POST :sessionId/actions", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw bad reqeust exception if actions is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/sessions/id/actions")
        .send({ actions: "invalid data" });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(["actions must be an array"]);
    });

    it("should throw bad reqeust exception if id is invalid", async () => {
      jest.spyOn(sessionService, "findBySessionId").mockResolvedValueOnce(null);
      const response = await request(app.getHttpServer())
        .post("/sessions/id/actions")
        .send({
          actions: [null, null, null],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        "Invalid session id or session is complted!",
      );
      expect(sessionService.findBySessionId).toHaveBeenCalledTimes(1);
      expect(sessionService.findBySessionId).toHaveBeenCalledWith("id");
    });

    it("should sessionDto on success", async () => {
      jest
        .spyOn(sessionService, "findBySessionId")
        .mockResolvedValueOnce({ completedAt: null } as any);
      jest
        .spyOn(sessionService, "addNewActionsToTheSession")
        .mockResolvedValueOnce({
          dataValues: {
            fieldState: "new field state",
          },
        } as any);

      const response = await request(app.getHttpServer())
        .post("/sessions/id/actions")
        .send({
          actions: [null, null, null],
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ fieldState: "new field state" });
      expect(sessionService.findBySessionId).toHaveBeenCalledTimes(1);
      expect(sessionService.findBySessionId).toHaveBeenCalledWith("id");
      expect(sessionService.addNewActionsToTheSession).toHaveBeenCalledTimes(1);
    });
  });
});
