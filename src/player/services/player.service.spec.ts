import { Test, TestingModule } from "@nestjs/testing";
import { PlayerService } from "./player.service";
import { PlayerDto } from "../dto/player.dto";
import { getModelToken } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";
import { NotFoundException } from "@nestjs/common";

describe("PlayerService", () => {
  let service: PlayerService;
  const playerDto: PlayerDto = {
    username: "testUser",
  };
  let mockPlayerModel;

  beforeEach(async () => {
    mockPlayerModel = {
      findOrCreate: jest
        .fn()
        .mockResolvedValue([{ dataValues: playerDto }, true]),
      findOne: jest.fn().mockImplementation(async ({ where: { username } }) => {
        if (username === playerDto.username) return { dataValues: playerDto };
        return null;
      }),
      findByPk: jest.fn().mockImplementation(async (id: string) => {
        if (id == "1-1-1-1-1") return { dataValues: playerDto };
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: getModelToken(Player), useValue: mockPlayerModel },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOrCreatePlayer", () => {
    it("should return player if exists or create new one.", async () => {
      expect(await service.findOrCreatePlayer("test")).toEqual(playerDto);
    });
  });

  describe("findByUsername", () => {
    it("should find the player and return playerDto", async () => {
      expect(await service.findByUsername("testUser")).toEqual(playerDto);
    });
    it("should return not found exception if player is null", async () => {
      await expect(service.findByUsername("invalid user")).rejects.toThrow(
        new NotFoundException("Player is not found!"),
      );
    });
  });

  describe("findByPlayerId", () => {
    it("should find the player and return playerDto", async () => {
      expect(await service.findByPlayerId("1-1-1-1-1")).toEqual(playerDto);
    });
    it("should return not found exception if player is null", async () => {
      await expect(service.findByPlayerId("in-va-lid-user-id")).rejects.toThrow(
        new NotFoundException("Player is not found!"),
      );
    });
  });
});
