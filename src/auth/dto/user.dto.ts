import { Exclude, Expose } from "class-transformer";
import { UUID } from "crypto";
import { Role } from "src/models/role.model";

export class UserDto {
  @Exclude()
  id: UUID;
  @Expose()
  username: string;
  @Exclude()
  passwordHash: string;
  @Expose()
  email: string;
  @Expose()
  roles: Role[];
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
