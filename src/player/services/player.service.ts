import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";
import { CreatePlayerDto } from "../dto/CreatePlayerDto.dto";
import { UUID } from "node:crypto";

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player)
    private readonly playerModel: typeof Player,
  ) {}

  createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerModel.create({
      username: createPlayerDto.username,
    });
  }

  getPlayer(id: UUID): Promise<Player | null> {
    return this.playerModel.findByPk<Player>(id);
  }
}
