import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { LoginUserDto } from "./dto/login-request.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserDto } from "./dto/user.dto";
import { TokensDto } from "./dto/tokens.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./services/users.service";
import { RefreshTokenRequestDto } from "./dto/refresh-token-request.dto";
import { jwtConstants } from "src/constants";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  @Post("login")
  async signIn(@Body() loginDto: LoginUserDto) {
    const token = await this.authService.signIn(
      loginDto.username.trim(),
      loginDto.password.trim(),
    );

    return new TokensDto(token);
  }

  @Post("register")
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.userService.createNewUser(dto);
    return new UserDto(user.dataValues);
  }

  @Post("refresh-token")
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenRequestDto,
  ): Promise<TokensDto> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.userService.findByPK(payload.sub);
    if (!user) {
      throw new NotFoundException("Invalid refresh token");
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.authService.generateTokens(user);
    this.userService.updateRefreshToken(tokens[1], user.id);

    return new TokensDto({
      accessToken: tokens[0],
      refreshToken: tokens[1],
    });
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
