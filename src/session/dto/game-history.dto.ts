import { Expose } from "class-transformer";

export class GameHistoryDto {
  @Expose()
  sessionId: string;
  @Expose()
  whitePlayer: string;
  @Expose()
  blackPlayer: string;
  @Expose()
  startedAt: Date;
  @Expose()
  completedAt: Date | null;

  constructor(
    sessionId: string,
    whitePlayer: string,
    blackPlayer: string,
    startedAt: Date,
    completedAt: Date | null,
  ) {
    this.sessionId = sessionId;
    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
  }
}
