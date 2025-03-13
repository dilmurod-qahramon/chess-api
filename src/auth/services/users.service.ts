import { Injectable } from "@nestjs/common";
import { User } from "src/models/user.model";
import { InjectModel } from "@nestjs/sequelize";
import { RegisterUserDto } from "../dto/register-user.dto";
import * as bcrypt from "bcrypt";
import { RolesEnum } from "src/types/roles.enum";
import { Role } from "src/models/role.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { username },
      include: { model: Role, through: { attributes: [] } },
    });
  }

  findByPK(id: string) {
    return this.userModel.findByPk(id, {
      include: { model: Role, through: { attributes: [] } },
    });
  }

  findOrCreateRole(role: RolesEnum) {
    return this.roleModel.findOrCreate({
      where: { role },
      defaults: { role },
    });
  }

  async createNewUser({
    username,
    email,
    password,
  }: RegisterUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    let roles: Role[] = [];

    if (email.startsWith("admin")) {
      roles.push((await this.findOrCreateRole(RolesEnum.Admin))[0]);
    } else {
      roles.push((await this.findOrCreateRole(RolesEnum.Owner))[0]);
    }

    const user = await this.userModel.create({
      username: username,
      email: email,
      passwordHash: password,
      roles: roles,
    });
    await user.$set("roles", roles);
    return user;
  }

  async updateRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    this.userModel.update(
      {
        refreshTokenHash: hashedRefreshToken,
      },
      {
        where: { userId: userId },
      },
    );
  }
}
