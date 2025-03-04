import { UUID } from "crypto";
import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { UserRole } from "./user-role.model";

@Table({ tableName: "users" })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: UUID;

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

  @HasMany(() => UserRole)
  roles: UserRole[];
}
