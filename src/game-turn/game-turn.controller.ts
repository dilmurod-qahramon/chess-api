import { Body, Controller, Post } from "@nestjs/common";
import { GameTurnService } from "./services/game-turn.service";
import { CreateGameTurnDto } from "./dto/create-game-turn.dto";

@Controller("game-turn")
export class GameTurnController {
  constructor(private readonly gameTurnService: GameTurnService) {}

  @Post()
  create(@Body() gameTurnDto: CreateGameTurnDto) {
    return this.gameTurnService.create(gameTurnDto);
  }
}
