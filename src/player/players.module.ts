import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { PlayerService } from "./services/player.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [SequelizeModule.forFeature([Player]), AuthModule],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayersModule {}

