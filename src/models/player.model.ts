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
  UpdatedAt,
} from "sequelize-typescript";
import { GameSession } from "./game_session.model";
import {
  InferAttributes,
  InferCreationAttributes,
} from "sequelize/types/model";

@Table({ tableName: "players", timestamps: true })
export class Player extends Model {
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

  @Column
  @UpdatedAt
  updated_at: Date;

  @HasMany(() => GameSession)
  game_sessions: GameSession[];
}
