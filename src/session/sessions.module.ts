import { Module } from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { SessionsController } from "./sessions.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";
import { GameTurn } from "src/models/game-turn.model";

@Module({
  imports: [SequelizeModule.forFeature([GameSession, GameTurn])],
  controllers: [SessionsController],
  providers: [SessionService],
})
export class SessionsModule {}
