import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/models/user.model";
import { InjectModel } from "@nestjs/sequelize";
import { RegisterUserDto } from "../dto/register-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { username } });
    if (user == null) {
      throw new NotFoundException("User is not found!");
    }

    return user;
  }

  async createNewUser(registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.userModel.create({
      username: registerUserDto.username,
      email: registerUserDto.email,
      passwordHash: registerUserDto.password,
    });

    return user;
  }
}
