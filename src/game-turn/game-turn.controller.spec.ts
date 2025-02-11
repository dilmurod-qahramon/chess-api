import { Test, TestingModule } from '@nestjs/testing';
import { GameTurnController } from './game-turn.controller';
import { GameTurnService } from './game-turn.service';

describe('GameTurnController', () => {
  let controller: GameTurnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameTurnController],
      providers: [GameTurnService],
    }).compile();

    controller = module.get<GameTurnController>(GameTurnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
