import { Exclude, Expose } from "class-transformer";
import { IsString, IsUUID } from "class-validator";
import { GameFieldState } from "src/types/GameFieldState.type";

export class SessionDto {
  @Expose()
  @IsUUID()
  id: string;
  @Expose()
  fieldState: GameFieldState;
  @Expose()
  @IsString()
  currentTurn: "left" | "right";
  @Exclude()
  leftPlayerId: string;
  @Exclude()
  rightPlayerId: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  turnDuration: number;
  @Exclude()
  nextTurnEndAt: Date;
  @Exclude()
  completedAt?: Date;
  @Exclude()
  updatedAt: Date;

  constructor(partial?: Partial<SessionDto>) {
    Object.assign(this, partial);
  }
}
