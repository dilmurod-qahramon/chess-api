import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { Player } from "./models/player.model";
import { SessionsModule } from "./session/session.module";
import { GameSession } from "./models/game-session.model";
import { PlayersModule } from "./player/players.module";
import { GameTurn } from "./models/game-turn.model";
import { AuthModule } from "./auth/auth.module";
import { User } from "./models/user.model";
import { RolesGuard } from "./auth/guards/roles.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [GameSession, GameTurn, Player, User],
      autoLoadModels: true,
      synchronize: true,
    }),
    SessionsModule,
    PlayersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
