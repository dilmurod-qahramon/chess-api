import { UUID } from "crypto";
import { GameTurnAction } from "src/models/game-turn.model";

export interface CreateGameTurnDto {
  playerId: UUID;
  gameSessionId: UUID;
  actions: GameTurnAction[];
}
