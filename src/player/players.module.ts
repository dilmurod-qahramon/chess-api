import { Module } from "@nestjs/common";
import { PlayersController } from "./players.controller";
import { PlayerService } from "./services/player.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";

@Module({
  imports: [SequelizeModule.forFeature([Player])],
  controllers: [PlayersController],
  providers: [PlayerService],
})
export class PlayersModule {}

