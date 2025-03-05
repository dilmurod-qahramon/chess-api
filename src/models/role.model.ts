import {
  AllowNull,
  BelongsToMany,
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
import { UserRoles } from "./user-roles.model";
import { RolesEnum } from "src/types/roles.enum";
import { UUIDV4 } from "sequelize";

@Table({ tableName: "roles" })
export class Role extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column({ field: "role_id" })
  roleId: string;

  @AllowNull(false)
  @Default(RolesEnum.Owner)
  @Column({
    type: DataType.ENUM(...Object.values(RolesEnum)),
    allowNull: false,
  })
  role: RolesEnum;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updatedAt: Date;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
