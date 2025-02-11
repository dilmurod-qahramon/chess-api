import { Module } from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { SessionsController } from "./sessions.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";

@Module({
  imports: [SequelizeModule.forFeature([GameSession])],
  controllers: [SessionsController],
  providers: [SessionService],
})
export class SessionsModule {}
