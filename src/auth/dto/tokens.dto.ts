import { Expose } from "class-transformer";
import { RolesEnum } from "src/types/roles.enum";

export class TokensDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  roles: RolesEnum[];

  constructor(partial: Partial<TokensDto>) {
    Object.assign(this, partial);
  }
}
