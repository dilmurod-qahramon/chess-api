import { UUID } from "node:crypto";
import {
  Column,
  Table,
  Model,
  AutoIncrement,
  DataType,
  CreatedAt,
  NotNull,
  Default,
  Unique,
  HasMany,
} from "sequelize-typescript";
import { Move } from "./move.model";

@Table({ tableName: "players" })
export class Player extends Model<Player> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: UUID;

  @Column(DataType.STRING)
  @Unique
  @NotNull
  username: string;

  @Column(DataType.CHAR)
  @Default("w")
  piece_color: "w" | "b";

  @Column
  @CreatedAt
  created_at: Date;

  @HasMany(() => Move)
  moves: Move[];
}
