import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models/user.model";
import { UsersService } from "./services/users.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/constants";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "src/models/role.model";
import { UserRoles } from "src/models/user-roles.model";

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard, UsersService],
})
export class AuthModule {}

