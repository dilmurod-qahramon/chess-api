import { UUID } from "crypto";
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Table,
  BelongsTo,
  Model,
} from "sequelize-typescript";
import { Player } from "./player.model";
import { GameSession } from "./game_session.model";

@Table({ tableName: "moves" })
export class Move extends Model<Move> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: UUID;

  @Column(DataType.STRING)
  move: string;

  @Column(DataType.DATE)
  @CreatedAt
  created_at: Date;

  @ForeignKey(() => GameSession)
  @Column(DataType.UUID)
  gameSessionId: UUID;

  @BelongsTo(() => GameSession)
  gameSession: GameSession;

  @ForeignKey(() => Player)
  @Column(DataType.UUID)
  playerId: UUID;

  @BelongsTo(() => Player)
  player: Player;
}
