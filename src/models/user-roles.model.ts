import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { Role } from "./role.model";
import { User } from "./user.model";

@Table({ tableName: "user_roles" })
export class UserRoles extends Model {
  @ForeignKey(() => Role)
  @Column({ field: "role_id" })
  roleId: string;

  @ForeignKey(() => User)
  @Column({ field: "user_id" })
  userId: string;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updatedAt: Date;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;
}
