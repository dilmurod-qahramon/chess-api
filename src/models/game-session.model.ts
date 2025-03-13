import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { GameTurn } from "./game-turn.model";
import { Player } from "./player.model";
import { GameFieldState } from "src/types/GameFieldState.type";
import { UUIDV4 } from "sequelize";

@Table({ tableName: "game_sessions", timestamps: true })
export class GameSession extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Player)
  @Column({ field: "left_player_id" })
  leftPlayerId: string;

  @AllowNull(false)
  @ForeignKey(() => Player)
  @Column({ field: "right_player_id" })
  rightPlayerId: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updatedAt: Date;

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

  @BelongsTo(() => Player, { foreignKey: "leftPlayerId", as: "leftPlayer" })
  leftPlayer: Player;

  @BelongsTo(() => Player, { foreignKey: "rightPlayerId", as: "rightPlayer" })
  rightPlayer: Player;

  @HasMany(() => GameTurn)
  gameTurns: GameTurn[];
}
