import { IsArray, IsNotEmpty } from "class-validator";
import { GameTurnActions } from "src/interfaces/GameTurnAction.type";

export class UpdateSessionDto {
  @IsNotEmpty()
  @IsArray()
  actions: GameTurnActions;
}
