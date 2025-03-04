import { Exclude, Expose } from "class-transformer";
import { UUID } from "crypto";

export class UserDto {
  @Exclude()
  id: UUID;
  @Expose()
  username: string;
  @Exclude()
  passwordHash: string;
  @Expose()
  email: string;
  @Exclude()
  hashedRefreshToken: string;
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
