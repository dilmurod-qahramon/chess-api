import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "./user.model";

export enum Role {
  Admin = "Admin",
  Owner = "Owner",
  Moderator = "Moderator",
}

Table({ tableName: "user_roles" });
export class UserRole extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
  })
  role: Role;

  @CreatedAt
  @Column({ type: DataType.DATE })
  created_at: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updated_at: Date;

  @BelongsTo(() => User)
  user: User;
}
