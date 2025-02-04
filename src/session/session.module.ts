import { Module } from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { SessionController } from "./controllers/session.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameSession } from "src/models/game_session.model";

@Module({
  imports: [SequelizeModule.forFeature([GameSession])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
