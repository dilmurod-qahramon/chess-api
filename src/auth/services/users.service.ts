import { Injectable } from "@nestjs/common";
import { User } from "src/models/user.model";
import { InjectModel } from "@nestjs/sequelize";
import { RegisterUserDto } from "../dto/register-user.dto";
import * as bcrypt from "bcrypt";
import { randomBytes, UUID } from "crypto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ where: { username } });
  }

  findByPK(id: UUID) {
    return this.userModel.findByPk(id);
  }

  async createNewUser({
    username,
    email,
    password,
  }: RegisterUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    return this.userModel.create({
      username: username,
      email: email,
      passwordHash: password,
    });
  }

  async updateRefreshToken(refreshToken: string, userId: UUID) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    this.userModel.update(
      {
        hashedRefreshToken: hashedRefreshToken,
      },
      {
        where: { id: userId },
      },
    );
  }
}
