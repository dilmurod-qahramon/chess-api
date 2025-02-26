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
  let mockSessionService: Partial<SessionService>;
  let mockPlayerService: Partial<PlayerService>;
  const sessionDto = new SessionDto();
  sessionDto.id = "1-1-1-1-1";
  sessionDto.currentTurn = "left";

  beforeEach(async () => {
    mockPlayerService = {
      findByPlayerId: jest.fn().mockImplementation((playerId: string) => {
        if (playerId === "1") {
          return { username: "user1" };
        } else if (playerId === "2") {
          return { username: "user2" };
        }
      }),
    };
    mockSessionService = {
      createNewSession: jest.fn().mockResolvedValue("some-id"),
      findBySessionId: jest.fn().mockImplementation(() => {
        return { dataValues: sessionDto };
      }),
      addNewActionsToTheSession: jest.fn().mockImplementation(() => {
        return { dataValues: sessionDto };
      }),
    };

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
      await expect(
        controller.createSession({
          leftPlayerId: "1",
          rightPlayerId: "3", // This ID is invalid, so it should throw
        }),
      ).rejects.toThrow(new BadRequestException("Invalid player id!"));
    });

    it("should return session id if succesfull", async () => {
      expect(
        await controller.createSession({
          leftPlayerId: "1",
          rightPlayerId: "2",
        }),
      ).toEqual("some-id");
    });
  });

  describe("findBySessionId action", () => {
    it("should return sessionDto", async () => {
      expect(await controller.findBySessionId("ran-dom-sess-ion-id")).toEqual({
        currentTurn: "left",
        id: "1-1-1-1-1",
      });
    });

    it("should throw not found exception if session is null", async () => {
      jest.spyOn(mockSessionService, "findBySessionId").mockResolvedValue(null);
      const result = controller.findBySessionId("1-1-1-1-1");
      await expect(result).rejects.toThrow(
        new NotFoundException("Invalid session id!"),
      );
    });
  });

  describe("addNewActionsToTheSession action", () => {
    it("should return sessionDto on success", async () => {
      const result = controller.addActionsToSession("ran-dom-sess-ion-id", {
        actions: [null, null, null],
      });
      expect(result).resolves.toEqual(sessionDto);
    });
  });
});
