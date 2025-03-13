import { Test, TestingModule } from "@nestjs/testing";
import { PlayerController } from "./player.controller";
import { PlayerService } from "./services/player.service";
import { PlayerDto } from "./dto/player.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { Player } from "src/models/player.model";

describe("PlayerController", () => {
  let controller: PlayerController;
  let mockPlayerService: Partial<PlayerService>;
  const playerDto = new PlayerDto();
  playerDto.username = "testUser";

  beforeEach(async () => {
    mockPlayerService = {
      findOrCreatePlayer: jest.fn(),
      findByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findOrCreatePlayer action", () => {
    it("findOrCreatePlayer should throw BadRequest on invalid username", async () => {
      const result = controller.findOrCreatePlayer("");
      await expect(result).rejects.toThrow(
        new BadRequestException(
          "Username cannot be empty or less than 5 characters.",
        ),
      );
    });

    it("findOrCreatePlayer should return PlayerDto", async () => {
      jest
        .spyOn(mockPlayerService, "findOrCreatePlayer")
        .mockResolvedValueOnce([
          {
            dataValues: { username: playerDto.username },
          },
        ] as any);
      const result = await controller.findOrCreatePlayer(playerDto.username);

      expect(mockPlayerService.findOrCreatePlayer).toHaveBeenCalledWith(
        playerDto.username,
      );
      expect(result).toEqual(playerDto);
    });
  });

  describe("findPlayerByUsername action", () => {
    it("should throw not found exception when findPlayerByUsername return null", async () => {
      jest.spyOn(mockPlayerService, "findByUsername").mockResolvedValue(null);
      await expect(
        controller.findPlayerByUsername(playerDto.username),
      ).rejects.toThrow(
        new NotFoundException(
          `Player with username "${playerDto.username}" is not found.`,
        ),
      );
    });

    it("findPlayerByUsername should return PlayerDto", async () => {
      jest
        .spyOn(mockPlayerService, "findByUsername")
        .mockResolvedValue({
          dataValues: { username: playerDto.username },
        } as any);
      const result = await controller.findPlayerByUsername(playerDto.username);
      expect(result).toEqual(playerDto);
    });
  });
});
