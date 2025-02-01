import { UUID } from "crypto";
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { Move } from "./move.model";

@Table({ tableName: "game_sessions" })
export class GameSession extends Model<GameSession> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: UUID;

  @Default("pending")
  @Column(DataType.STRING)
  current_status: "pending" | "ongoing" | "completed";

  @Column
  @UpdatedAt
  last_move: Date;

  @Column
  @CreatedAt
  started_at: Date;

  @HasMany(() => Move)
  moves: Move[];
}
