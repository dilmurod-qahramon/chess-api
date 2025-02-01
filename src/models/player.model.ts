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

<<<<<<< HEAD
  @Unique
  @Column(DataType.STRING)
  username: string;

  @Default("w")
  @Column(DataType.CHAR)
=======
  @Column(DataType.STRING)
  @Unique
  @NotNull
  username: string;

  @Column(DataType.CHAR)
  @Default("w")
>>>>>>> def20f5fea83b3ca3d199ac37e74324c6a5346ff
  piece_color: "w" | "b";

  @Column
  @CreatedAt
  created_at: Date;

  @HasMany(() => Move)
  moves: Move[];
}
