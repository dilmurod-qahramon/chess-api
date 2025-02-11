import { UUID } from "node:crypto";

export class CreateSessionDto {
  leftPlayerId: UUID;
  rightPlayerId: UUID;
  turnDuration: number;
}
