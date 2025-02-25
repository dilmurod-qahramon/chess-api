import { UUID } from "crypto";
import {
  AllowNull,
  Column,
  DataType,
  Default,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

@Table({ tableName: "users" })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: UUID;

  @Unique
  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  passwordHash: string;

  @IsEmail
  @AllowNull(false)
  @Column
  email: string;
}
