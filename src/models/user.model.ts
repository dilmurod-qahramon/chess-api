import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import { Role } from "./role.model";
import { UserRoles } from "./user-roles.model";

@Table({ tableName: "users" })
export class User extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column({ field: "user_id" })
  userId: string;

  @Unique
  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column({ field: "password" })
  passwordHash: string;

  @IsEmail
  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(true)
  @Column({ field: "refresh_token" })
  refreshTokenHash: string;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updatedAt: Date;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  createdAt: Date;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
