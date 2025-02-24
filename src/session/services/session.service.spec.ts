import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./session.service";
import { SessionDto } from "../dto/session.dto";
import { getModelToken } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";
import { GameTurn } from "src/models/game-turn.model";
import { Sequelize } from "sequelize-typescript";
import { NotFoundException } from "@nestjs/common";

describe("SessionService", () => {
  let service: SessionService;
  let mockSessionModel;
  let mockGameTurnModel;
  let mockSequelize;

  const sessionDto: Partial<SessionDto> = {};
  beforeEach(async () => {
    mockSessionModel = {
      update: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({ id: "some id" }),
      findByPk: jest.fn().mockImplementation(async (id: string) => {
        if (id == "1-1-1-1-1") return { dataValues: sessionDto };
        return null;
      }),
    };
    mockGameTurnModel = {
      create: jest.fn().mockResolvedValue({}),
    };
    mockSequelize = {
      transaction: jest.fn().mockImplementation(async (callback) => {
        return callback({ commit: jest.fn(), rollback: jest.fn() });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: Sequelize, useValue: mockSequelize },
        { provide: getModelToken(GameSession), useValue: mockSessionModel },
        { provide: getModelToken(GameTurn), useValue: mockGameTurnModel },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createNewSession", () => {
    it("should create a new session and return its id only", async () => {
      expect(
        await service.createNewSession({ leftPlayerId: "", rightPlayerId: "" }),
      ).toStrictEqual("some id");
    });
  });

  describe("findBySessionId", () => {
    it("should return session dto if id is valid", async () => {
      await expect(service.findBySessionId("1-1-1-1-1")).resolves.toStrictEqual(
        sessionDto,
      );
    });

    it("should throw not found exception if id is invalid", async () => {
      await expect(service.findBySessionId("1-1-1-1-2")).rejects.toThrow(
        new NotFoundException("Invalid session id!"),
      );
    });
  });

  describe("addNewActionsToTheSession", () => {
    it("should be implemented when it is completed", async () => {
      expect("not implemeted").toBe("implemeted");
    });
  });
});
