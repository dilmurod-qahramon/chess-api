import { Test, TestingModule } from "@nestjs/testing";
import { PlayerService } from "./player.service";
import { getModelToken } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";

describe("PlayerService", () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: getModelToken(Player), useValue: {} },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
