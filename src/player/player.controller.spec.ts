import { Test, TestingModule } from "@nestjs/testing";
import { PlayerController } from "./player.controller";
import { PlayerService } from "./services/player.service";
import { PlayerDto } from "./dto/player.dto";
import { BadRequestException } from "@nestjs/common";

describe("PlayerController", () => {
  let controller: PlayerController;
  let mockPlayerService: Partial<PlayerService>;
  const playerDto: PlayerDto = {
    username: "testUser",
  };

  beforeEach(async () => {
    mockPlayerService = {
      findOrCreatePlayer: jest.fn().mockResolvedValue(playerDto),
      findByUsername: jest.fn().mockResolvedValue(playerDto),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findOrCreatePlayer action", () => {
    it("findOrCreatePlayer should throw BadRequest on invalid username", async () => {
      await expect(controller.findOrCreatePlayer("")).rejects.toThrow(
        new BadRequestException("Username cannot be empty"),
      );
    });

    it("findOrCreatePlayer should return PlayerDto", async () => {
      const result = await controller.findOrCreatePlayer("testUser");
      expect(result).toEqual({ username: "testUser" });
    });
  });

  describe("findPlayerByUsername action", () => {
    it("findPlayerByUsername should throw BadRequest on invalid username", async () => {
      await expect(controller.findPlayerByUsername("")).rejects.toThrow(
        new BadRequestException("Username cannot be empty"),
      );
    });

    it("findPlayerByUsername should return PlayerDto", async () => {
      const result = await controller.findPlayerByUsername("testUser");
      expect(result).toEqual({ username: "testUser" });
    });
  });
});
