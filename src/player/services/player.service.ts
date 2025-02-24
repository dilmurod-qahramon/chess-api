import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UUID } from "crypto";
import { Player } from "src/models/player.model";

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

    return player[0].dataValues;
  }

  async findByUsername(username: string) {
    const player = await this.playerModel.findOne({ where: { username } });
    if (player == null) {
      throw new NotFoundException("Player is not found!");
    }
    return player.dataValues;
  }

  async findByPlayerId(playerId: UUID) {
    const player = await this.playerModel.findByPk(playerId);
    if (player == null) {
      throw new NotFoundException("Player is not found!");
    }

    return player.dataValues;
  }
}
