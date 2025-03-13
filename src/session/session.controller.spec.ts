import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./services/session.service";
import { SessionController } from "./session.controller";
import { PlayerService } from "../player/services/player.service";
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { SessionDto } from "./dto/session.dto";

describe("SessionController", () => {
  let controller: SessionController;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockPlayerService: jest.Mocked<PlayerService>;
  const sessionDto = new SessionDto();
  sessionDto.id = "test id";
  sessionDto.currentTurn = "left";

  beforeEach(async () => {
    mockPlayerService = {
      findByPlayerId: jest.fn(),
    } as unknown as jest.Mocked<PlayerService>;
    mockSessionService = {
      createNewSession: jest.fn(),
      findBySessionId: jest.fn(),
      addNewActionsToTheSession: jest.fn(),
    } as unknown as jest.Mocked<SessionService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SessionController>(SessionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createNewSession action", () => {
    it("should throw BadRequest if one of players does not exist", async () => {
      mockPlayerService.findByPlayerId
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce(null);
      const result = controller.createSession({
        leftPlayerId: "1",
        rightPlayerId: "2",
      });
      await expect(result).rejects.toThrow(
        new BadRequestException("Invalid player id!"),
      );
      expect(mockPlayerService.findByPlayerId).toHaveBeenCalledTimes(2);
    });

    it("should return session id if succesfull", async () => {
      const dto = {
        leftPlayerId: "1",
        rightPlayerId: "2",
      };
      mockPlayerService.findByPlayerId
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce({} as any);
      mockSessionService.createNewSession.mockResolvedValueOnce("some-id");
      const result = await controller.createSession(dto);
      expect(result).toEqual("some-id");
      expect(mockPlayerService.findByPlayerId).toHaveBeenCalledTimes(2);
      expect(mockSessionService.createNewSession).toHaveBeenCalledWith(dto);
    });
  });

  describe("findBySessionId action", () => {
    it("should return sessionDto", async () => {
      mockSessionService.findBySessionId.mockResolvedValueOnce({
        dataValues: sessionDto,
      } as any);
      const result = await controller.findBySessionId(sessionDto.id);
      expect(result).toEqual(sessionDto);
      expect(mockSessionService.findBySessionId).toHaveBeenCalledWith(
        sessionDto.id,
      );
    });

    it("should throw not found exception if session is null", async () => {
      jest.spyOn(mockSessionService, "findBySessionId").mockResolvedValue(null);
      const result = controller.findBySessionId(sessionDto.id);
      await expect(result).rejects.toThrow(
        new NotFoundException("Invalid session id!"),
      );
      expect(mockSessionService.findBySessionId).toHaveBeenCalledTimes(1);
    });

    it("should throw bad request exception if session is null", async () => {
      jest
        .spyOn(mockSessionService, "findBySessionId")
        .mockResolvedValue({ completedAt: new Date() } as any);
      const result = controller.findBySessionId(sessionDto.id);
      await expect(result).rejects.toThrow(
        new BadRequestException("Session is already over!"),
      );
      expect(mockSessionService.findBySessionId).toHaveBeenCalledTimes(1);
    });
  });

  describe("addNewActionsToTheSession action", () => {
    it("should return sessionDto on success", async () => {});
  });
});
