import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UUID } from "crypto";
import { Player } from "src/models/player.model";

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player)
    private readonly playerModel: typeof Player,
  ) {}

  findOrCreatePlayer(username: string) {
    return this.playerModel.findOrCreate({
      where: { username },
      defaults: { username },
    });
  }

  findByUsername(username: string) {
    return this.playerModel.findOne({ where: { username } });
  }

  findByPlayerId(playerId: UUID) {
    return this.playerModel.findByPk(playerId);
  }
}
