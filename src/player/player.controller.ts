import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/CreatePlayerDto.dto";
import { PlayerService } from "./services/player.service";
import { UUID } from "node:crypto";

@Controller("player")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playerService.createPlayer(createPlayerDto);
  }

  @Get(":id")
  async getPlayer(@Param("id") id: UUID) {
    return await this.playerService.getPlayer(id);
  }
}
