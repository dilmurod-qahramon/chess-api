import { UUID } from "crypto";
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { GameTurn } from "./game-turn.model";
import { Player } from "./player.model";
import { GameFieldState } from "src/types/GameFieldState.type";

@Table({ tableName: "game_sessions", timestamps: true })
export class GameSession extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: UUID;

  @AllowNull(false)
  @ForeignKey(() => Player)
  @Column({ field: "left_player_id" })
  leftPlayerId: UUID;

  @AllowNull(false)
  @ForeignKey(() => Player)
  @Column({ field: "right_player_id" })
  rightPlayerId: UUID;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;

  @AllowNull(false)
  @Default(60)
  @Column({ field: "turn_duration", type: DataType.INTEGER })
  turnDuration: number;

  @AllowNull(false)
  @Column({ field: "field_state", type: DataType.JSONB })
  fieldState: GameFieldState;

  // @AllowNull(false)
  // @Column({ field: "field_state", type: DataType.JSONB })
  // get fieldState(): GameFieldState {
  //   return JSON.parse(this.getDataValue("fieldState"));
  // }

  // set fieldState(value: GameFieldState) {
  //   this.setDataValue("fieldState", JSON.stringify(value));
  // }

  @AllowNull(false)
  @Default("left")
  @Column({ field: "current_turn", type: DataType.STRING })
  currentTurn: "left" | "right"; // default 'white'

  @AllowNull(false)
  @Column({ field: "next_turn_end_at", type: DataType.DATE })
  nextTurnEndAt: Date; // default 'createdAt' + 'turnDuration'

  @AllowNull(true)
  @Column({ field: "completed_at" })
  completedAt?: Date;

  @BelongsTo(() => Player)
  leftPlayer: Player;

  @BelongsTo(() => Player)
  rightPlayer: Player;

  @HasMany(() => GameTurn)
  gameTurns: GameTurn[];
}
