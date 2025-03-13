import { Test, TestingModule } from "@nestjs/testing";
import { GameTurnService } from "./game-turn.service";
import { getModelToken } from "@nestjs/sequelize";
import { GameTurn } from "src/models/game-turn.model";

describe("gameTurnService", () => {
  let service: GameTurnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameTurnService,
        {
          provide: getModelToken(GameTurn),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GameTurnService>(GameTurnService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
