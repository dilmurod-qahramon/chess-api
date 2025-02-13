import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";
import { PlayerDto } from "../dto/player.dto";

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player)
    private readonly playerModel: typeof Player,
  ) {}

  async findOrCreatePlayer(username: string) {
    const player = await this.playerModel.findOrCreate({
      where: { username },
      defaults: { username },
    });

    const dto: PlayerDto = {
      id: player[0].id,
      username: player[0].username,
    };

    return dto;
  }

  async findByUsername(username: string) {
    const player = await this.playerModel.findOne({ where: { username } });
    if (player != null) {
      const dto: PlayerDto = {
        id: player.id,
        username: player.username,
      };
      return dto;
    }
    return player;
  }
}
