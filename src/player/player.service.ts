import { Injectable } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player)
    private playerModel: typeof Player,
  ) {}

  create(createPlayerDto: CreatePlayerDto) {
    return "This action adds a new player";
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.findAll();
  }

  findOne(id: number): Promise<Player | null> {
    return this.playerModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await user?.destroy();
  }
}
