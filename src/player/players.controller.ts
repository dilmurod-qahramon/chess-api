import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/CreatePlayerDto.dto";
import { PlayerService } from "./services/player.service";
import { UUID } from "node:crypto";

@Controller("players")
export class PlayersController {
  constructor(private playerService: PlayerService) {}

  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.createPlayer(createPlayerDto);
  }

  @Get(":id")
  getPlayer(@Param("id") id: UUID) {
    return this.playerService.getPlayer(id);
  }
}
