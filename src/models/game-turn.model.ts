import { UUID } from "crypto";
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { GameActorTypes, GameSession } from "./game-session.model";
import { Player } from "./player.model";

@Table({ tableName: "game_turns", timestamps: true, updatedAt: false })
export class GameTurn extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: UUID;

  @AllowNull(false)
  @ForeignKey(() => GameSession)
  @Column({ field: "game_session_id" })
  gameSessionId: string;

  @AllowNull(false)
  @ForeignKey(() => Player)
  @Column({ field: "player_id" })
  playerId: string;

  @Column({ field: "created_at", type: DataType.DATE })
  @CreatedAt
  createdAt: Date;

  @AllowNull(false)
  @Column({ field: "actions", type: DataType.JSONB })
  get actions(): GameTurnActions {
    return JSON.parse(this.getDataValue("actions"));
  }

  set actions(value: GameTurnActions) {
    this.setDataValue("actions", JSON.stringify(value));
  }

  @BelongsTo(() => Player)
  player: Player;

  @BelongsTo(() => GameSession)
  gameSession: GameSession;
}

export type GameTurnAction =
  | { type: "move"; oldPlace: string; newPlace: string }
  | { type: "swap"; place1: string; place2: string }
  | { type: "upgrade"; place1: string; toType: GameActorTypes };

export type GameTurnActions = GameTurnAction[];
