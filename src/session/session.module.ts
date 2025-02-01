<<<<<<< HEAD
import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameSession } from "src/models/game_session.model";
import { Move } from "src/models/move.model";
import { Player } from "src/models/player.model";

@Module({
  imports: [SequelizeModule.forFeature([GameSession, Move, Player])],
=======
import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
>>>>>>> def20f5fea83b3ca3d199ac37e74324c6a5346ff
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
