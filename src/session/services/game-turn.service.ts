import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { GameTurn } from "src/models/game-turn.model";
import { GameTurnActions } from "src/types/GameTurnAction.type";

@Injectable()
export class GameTurnService {
  constructor(
    @InjectModel(GameTurn)
    private readonly gameTurnModel: typeof GameTurn,
  ) {}

  createNewGameTurn(
    sessionId: string,
    playerId: string,
    actions: GameTurnActions,
    t: Transaction,
  ) {
    return this.gameTurnModel.create(
      {
        gameSessionId: sessionId,
        playerId: playerId,
        actions: actions,
      },
      { transaction: t },
    );
  }
}
