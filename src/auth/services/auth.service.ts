import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import { TokensDto } from "../dto/tokens.dto";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "src/constants";
import { User } from "src/models/user.model";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<TokensDto> {
    const user = await this.usersService.findByUsername(username);
    if (user == null) {
      throw new NotFoundException("User is not found!");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user);
    this.usersService.updateRefreshToken(tokens[1], user.id);

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }

  async generateTokens({ id, username }: User) {
    const refreshTokenPayload = { sub: id };
    const newRefreshToken = await this.jwtService.signAsync(
      refreshTokenPayload,
      {
        expiresIn: REFRESH_TOKEN_EXP,
      },
    );

    const payload = { sub: id, username: username };
    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXP,
    });

    return [newAccessToken, newRefreshToken];
  }
}
