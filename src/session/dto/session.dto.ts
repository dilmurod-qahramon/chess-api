import { Exclude, Expose, Transform } from "class-transformer";
import { IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { GameFieldState } from "src/interfaces/GameFieldState.type";

export class SessionDto {
  @Expose()
  @IsUUID()
  id: UUID;
  @Expose()
  fieldState: GameFieldState;
  @Expose()
  @IsString()
  currentTurn: "left" | "right";
  @Exclude()
  leftPlayerId: UUID;
  @Exclude()
  rightPlayerId: UUID;
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

  constructor(partial: Partial<SessionDto>) {
    Object.assign(this, partial);
  }
}
