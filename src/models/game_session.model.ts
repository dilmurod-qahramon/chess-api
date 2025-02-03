import { UUID } from "crypto";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { Move } from "./move.model";
import { Player } from "./player.model";

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

  @ForeignKey(() => Player)
  @Column(DataType.UUID)
  playerId: UUID;

  @BelongsTo(() => Player)
  player: Player;
}
