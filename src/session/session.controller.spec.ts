import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./services/session.service";
import { SessionController } from "./session.controller";
import { PlayerService } from "../player/services/player.service";
import {
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";

describe("SessionController", () => {
  let controller: SessionController;
  let mockSessionService: Partial<SessionService>;
  let mockPlayerService: Partial<PlayerService>;

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
      findBySessionId: jest.fn().mockResolvedValue({
        id: "ran-dom-sess-ion-id",
        fieldState: "test field state",
      }),
      addNewActionsToTheSession: jest
        .fn()
        .mockImplementation((dto: { actions: string }, id: string) => {
          if (id == "ran-dom-sess-ion-id") {
            return "working succesfully";
          } else {
            throw new InternalServerErrorException();
          }
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compile();

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
      expect(
        await controller.findBySessionId("ran-dom-sess-ion-id"),
      ).toStrictEqual({
        id: "ran-dom-sess-ion-id",
        fieldState: "test field state",
      });
    });
  });

  describe("addNewActionsToTheSession action", () => {
    it("should return sessionDto on success", async () => {
      expect(
        await controller.addActionsToSession("ran-dom-sess-ion-id", {
          actions: [null, null, null],
        }),
      ).toBe("working succesfully");
    });

    it("should throw internal server error", async () => {
      await expect(
        controller.addActionsToSession("in-v-al-id-id", {
          actions: [null, null, null],
        }),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });
});
