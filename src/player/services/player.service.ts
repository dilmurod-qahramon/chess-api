import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UUID } from "crypto";
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

    return new PlayerDto(player[0].dataValues);
  }

  async findByUsername(username: string) {
    const player = await this.playerModel.findOne({ where: { username } });
    if (player == null) {
      throw new NotFoundException("player is not found!");
    }
    return new PlayerDto(player.dataValues);
  }

  async findByPlayerId(playerId: UUID) {
    const player = await this.playerModel.findByPk(playerId);
    if (player == null) {
      throw new NotFoundException("player is not found!");
    }

    return new PlayerDto(player.dataValues);
  }
}
