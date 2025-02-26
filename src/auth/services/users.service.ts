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

  findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ where: { username } });
  }

  createNewUser(registerUserDto: RegisterUserDto): Promise<User> {
    return this.userModel.create({
      username: registerUserDto.username,
      email: registerUserDto.email,
      passwordHash: registerUserDto.password,
    });
  }
}
