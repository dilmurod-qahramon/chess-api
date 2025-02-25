import { UUID } from "node:crypto";
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { GameSession } from "./game-session.model";

@Table({ tableName: "players", timestamps: true, updatedAt: false })
export class Player extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: UUID;

  @AllowNull(false)
  @Unique
  @Column({ field: "username", type: DataType.STRING })
  username: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;

  @HasMany(() => GameSession)
  gameSessions: GameSession[];
}
