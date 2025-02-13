import { Controller, Get, Param, Post } from "@nestjs/common";
import { PlayerService } from "./services/player.service";

@Controller("players")
export class PlayersController {
  constructor(private playerService: PlayerService) {}
  //rename to FindOrCreatePlayer return PlayerDto
  @Post(":username")
  findOrCreatePlayer(@Param("username") username: string) {
    return this.playerService.findOrCreatePlayer(username);
  }

  @Get(":username")
  findPlayerByUsername(@Param("username") username: string) {
    return this.playerService.findByUsername(username);
  }
}
