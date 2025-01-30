import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { PlayerModule } from "./player/player.module";
import { Player } from "./models/player.model";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "Ac1731845",
      database: "chessapp",
      models: [Player],
      autoLoadModels: true,
      synchronize: true,
    }),
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
