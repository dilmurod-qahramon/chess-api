import { Module } from "@nestjs/common";
import { GameTurnController } from "./game-turn.controller";
import { GameTurnService } from "./services/game-turn.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameTurn } from "src/models/game-turn.model";

@Module({
  imports: [SequelizeModule.forFeature([GameTurn])],
  controllers: [GameTurnController],
  providers: [GameTurnService],
})
export class GameTurnModule {}
