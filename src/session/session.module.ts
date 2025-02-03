import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameSession } from "src/models/game_session.model";

@Module({
  imports: [SequelizeModule.forFeature([GameSession])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
