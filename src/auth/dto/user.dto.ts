import { Exclude, Expose } from "class-transformer";
import { UUID } from "crypto";

export class UserDto {
  @Expose()
  id: UUID;
  @Expose()
  username: string;
  @Exclude()
  passwordHash: string;
  @Expose()
  email: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
