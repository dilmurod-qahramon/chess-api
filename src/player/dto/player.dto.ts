import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { UUID } from "crypto";

export class PlayerDto {
  @Expose()
  id?: UUID;

  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @Exclude()
  createdAt?: Date;

  constructor(partial: Partial<PlayerDto>) {
    Object.assign(this, partial);
  }
}
