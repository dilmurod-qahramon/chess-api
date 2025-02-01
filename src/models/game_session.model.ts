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

<<<<<<< HEAD
  @Default("pending")
  @Column(DataType.STRING)
=======
  @Column(DataType.STRING)
  @Default("pending")
>>>>>>> def20f5fea83b3ca3d199ac37e74324c6a5346ff
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
