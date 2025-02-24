import { Module } from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { SessionController } from "./session.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";
import { GameTurn } from "src/models/game-turn.model";
import { PlayersModule } from "src/player/players.module";

@Module({
  imports: [SequelizeModule.forFeature([GameSession, GameTurn]), PlayersModule],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionsModule {}
