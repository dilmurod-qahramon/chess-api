import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { PlayerService } from "./player.service";

@Controller("players")
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.playerService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.playerService.remove(+id);
  }
}
