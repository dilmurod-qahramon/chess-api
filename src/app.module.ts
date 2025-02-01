import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { Player } from "./models/player.model";
import { SessionModule } from "./session/session.module";
import { GameSession } from "./models/game_session.model";
import { Move } from "./models/move.model";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
<<<<<<< HEAD
      models: [GameSession, Move, Player],
      autoLoadModels: true,
=======
      models: [Player, Move, GameSession],
>>>>>>> def20f5fea83b3ca3d199ac37e74324c6a5346ff
      synchronize: true,
    }),
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
