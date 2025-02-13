import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { Player } from "./models/player.model";
import { SessionsModule } from "./session/sessions.module";
import { GameSession } from "./models/game-session.model";
import { PlayersModule } from "./player/players.module";
import { GameTurn } from "./models/game-turn.model";

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
      models: [GameSession, GameTurn, Player],
      autoLoadModels: true,
      synchronize: true,
    }),
    SessionsModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
