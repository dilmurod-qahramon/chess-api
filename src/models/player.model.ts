import { UUID } from "node:crypto";
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { GameSession } from "./game-session.model";

@Table({ tableName: "players", timestamps: true, updatedAt: false })
export class Player extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: UUID;

  @AllowNull(false)
  @Column({ field: "username", type: DataType.STRING })
  username: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;

  @HasMany(() => GameSession)
  gameSessions: GameSession[];
}
