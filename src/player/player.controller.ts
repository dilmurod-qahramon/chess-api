import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PlayerService } from "./services/player.service";
import { PlayerDto } from "./dto/player.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("players")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post(":username")
  async findOrCreatePlayer(@Param("username") username: string) {
    username = username?.trim();
    if (!username || username.length < 5) {
      throw new BadRequestException(
        "Username cannot be empty or less than 5 characters.",
      );
    }

    const player = await this.playerService.findOrCreatePlayer(username);
    return new PlayerDto(player[0].dataValues);
  }

  @Get(":username")
  async findPlayerByUsername(
    @Param("username") username: string,
  ): Promise<PlayerDto> {
    username = username?.trim();
    if (!username || username.length < 5) {
      throw new BadRequestException(
        "Username cannot be empty or less than 5 characters.",
      );
    }
    console.log(username);
    const player = await this.playerService.findByUsername(username);
    console.log(player);

    if (!player) {
      throw new NotFoundException(
        `Player with username "${username}" is not found.`,
      );
    }

    return new PlayerDto(player.dataValues);
  }
}
