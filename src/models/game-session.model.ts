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

@Table({ tableName: "game_sessions", timestamps: true })
export class GameSession extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: UUID;

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

  @AllowNull(false)
  @Column({ field: "turn_duration", type: DataType.INTEGER })
  turnDuration: number; // default 60 sec

  @AllowNull(false)
  @Column({ field: "field_state", type: DataType.JSONB })
  get fieldState(): GameFieldState {
    return JSON.parse(this.getDataValue("fieldState"));
  }

  set fieldState(value: GameFieldState) {
    this.setDataValue("fieldState", JSON.stringify(value));
  }

  @AllowNull(false)
  @Default("left")
  @Column({ field: "next_turn_for_player", type: DataType.STRING })
  nextTurnForPlayer: "left" | "right"; // default 'white'

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

export enum GameActorTypes {
  King = 0,
  Queen = 1,
  Rook = 2,
  Bishop = 3,
  Knight = 4,
  Pawn = 5,
}

export type GameActor = { team: "white" | "black"; type: GameActorTypes };

export type GameFieldState = (GameActor | null)[][];
