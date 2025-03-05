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
import { UUIDV4 } from "sequelize";

@Table({ tableName: "players", timestamps: true, updatedAt: false })
export class Player extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  username: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;

  @HasMany(() => GameSession)
  gameSessions: GameSession[];
}
