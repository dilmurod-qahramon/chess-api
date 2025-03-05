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
import { GameSession } from "./game-session.model";
import { Player } from "./player.model";
import { GameTurnActions } from "src/types/GameTurnAction.type";
import { UUIDV4 } from "sequelize";

@Table({ tableName: "game_turns", timestamps: true, updatedAt: false })
export class GameTurn extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @ForeignKey(() => GameSession)
  @Column({ field: "game_session_id" })
  gameSessionId: string;

  @AllowNull(false)
  @ForeignKey(() => Player)
  @Column({ field: "player_id" })
  playerId: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
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
