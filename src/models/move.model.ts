import { UUID } from "crypto";
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Table,
  BelongsTo,
  Model,
  UpdatedAt,
} from "sequelize-typescript";
import { GameSession } from "./game_session.model";

@Table({ tableName: "moves", timestamps: true })
export class Move extends Model {
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

  @Column
  @UpdatedAt
  updated_at: Date;

  @ForeignKey(() => GameSession)
  @Column(DataType.UUID)
  game_session_id: UUID;

  @BelongsTo(() => GameSession)
  gameSession: GameSession;
}
