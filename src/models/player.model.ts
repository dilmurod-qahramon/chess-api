import { UUID } from "node:crypto";
import {
  Column,
  Table,
  Model,
  AutoIncrement,
  DataType,
  CreatedAt,
  NotNull,
  Default,
  Unique,
  HasMany,
} from "sequelize-typescript";
import { GameSession } from "./game_session.model";

@Table({ tableName: "players" })
export class Player extends Model<Player> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: UUID;

  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  opponent_username: string;

  @Default("w")
  @Column(DataType.CHAR)
  piece_color: "w" | "b";

  @Column
  @CreatedAt
  created_at: Date;

  @HasMany(() => GameSession)
  game_sessions: GameSession[];
}
