import { UUID } from "crypto";
import { GameFieldState } from "src/interfaces/GameFieldState.type";

export interface SessionDto {
  id: UUID;
  fieldState: GameFieldState;
}
