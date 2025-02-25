import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { PlayerService } from "./services/player.service";
import { PlayerDto } from "./dto/player.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller("players")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post(":username")
  async findOrCreatePlayer(
    @Param("username") username: string,
  ): Promise<PlayerDto> {
    if (!username || !username.trim()) {
      throw new BadRequestException("Username cannot be empty");
    }

    return new PlayerDto(await this.playerService.findOrCreatePlayer(username));
  }

  @Get(":username")
  async findPlayerByUsername(
    @Param("username") username: string,
  ): Promise<PlayerDto> {
    if (!username || !username.trim()) {
      throw new BadRequestException("Username cannot be empty");
    }

    return new PlayerDto(await this.playerService.findByUsername(username));
  }
}
