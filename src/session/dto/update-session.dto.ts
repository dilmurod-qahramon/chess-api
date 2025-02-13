import { UUID } from "crypto";
import { GameFieldState } from "src/interfaces/GameFieldState.type";
import { GameTurnActions } from "src/interfaces/GameTurnAction.type";

export class UpdateSessionDto {
  fieldState: GameFieldState;
  currentTurn: "left" | "right";
  actions: GameTurnActions;
  playerId: UUID;
}
