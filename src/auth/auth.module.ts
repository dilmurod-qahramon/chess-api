import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models/user.model";
import { UsersService } from "./services/users.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/constants";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "6000s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}

