import { Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { InjectModel } from "@nestjs/sequelize";
import { GameSession } from "src/models/game_session.model";
import { UUID } from "crypto";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(GameSession)
    private readonly gameSessionModel: typeof GameSession,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    return await this.gameSessionModel.create<GameSession>({
      ...createSessionDto,
    });
  }

  async findAll() {
    return await this.gameSessionModel.findAll();
  }

  async findById(id: UUID) {
    return await this.gameSessionModel.findByPk(id);
  }

  async update(id: UUID, updateSessionDto: UpdateSessionDto) {
    const game_session = await this.findById(id);
    await game_session!.update(updateSessionDto);
    return await game_session!.update(updateSessionDto);
  }

  async remove(id: UUID) {
    return await this.gameSessionModel.destroy({ where: { id } });
  }
}
