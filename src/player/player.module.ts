import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { PlayerService } from "./services/player.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";

@Module({
  imports: [SequelizeModule.forFeature([Player])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}

