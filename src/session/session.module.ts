import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameSession } from "src/models/game_session.model";
import { Move } from "src/models/move.model";
import { Player } from "src/models/player.model";

@Module({
  imports: [SequelizeModule.forFeature([GameSession, Move, Player])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
