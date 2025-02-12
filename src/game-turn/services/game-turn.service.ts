import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GameTurn } from "src/models/game-turn.model";
import { CreateGameTurnDto } from "../dto/create-game-turn.dto";

@Injectable()
export class GameTurnService {
  constructor(
    @InjectModel(GameTurn)
    private readonly gameTurnModel: typeof GameTurn,
  ) {}

  create(gameTurnDto: CreateGameTurnDto) {
    return this.gameTurnModel.create<GameTurn>({
      gameSessionId: gameTurnDto.gameSessionId,
      playerId: gameTurnDto.playerId,
      actions: gameTurnDto.actions,
    });
  }
}
