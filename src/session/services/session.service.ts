import { Injectable } from "@nestjs/common";
import { CreateSessionDto } from "../dto/create-session.dto";
import { InjectModel } from "@nestjs/sequelize";
import {
  GameActorTypes,
  GameFieldState,
  GameSession,
} from "src/models/game-session.model";
import { UUID } from "crypto";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(GameSession)
    private readonly gameSessionModel: typeof GameSession,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const gameSession = new this.gameSessionModel();
    gameSession.leftPlayerId = createSessionDto.leftPlayerId;
    gameSession.rightPlayerId = createSessionDto.rightPlayerId;
    gameSession.turnDuration = createSessionDto.turnDuration ?? 60;
    gameSession.nextTurnEndAt = new Date();
    gameSession.fieldState = this.initBoard();

    await gameSession.save();
    return gameSession;
  }

  async findById(id: UUID) {
    return await this.gameSessionModel.findByPk(id);
  }

  // async update(id: UUID, updateSessionDto: UpdateSessionDto) {
  //   const game_session = await this.findById(id);
  //   await game_session!.update(updateSessionDto);
  //   return await game_session!.update(updateSessionDto);
  // }

  // remove(id: UUID) {
  //   return this.gameSessionModel.destroy({ where: { id } });
  // }

  private initBoard(): GameFieldState {
    const emptyRow = Array(8).fill(null);
    const emptyBoard: GameFieldState = Array(8)
      .fill(null)
      .map(() => [...emptyRow]);

    const backRowOrder: GameActorTypes[] = [
      GameActorTypes.Rook,
      GameActorTypes.Knight,
      GameActorTypes.Bishop,
      GameActorTypes.Queen,
      GameActorTypes.King,
      GameActorTypes.Bishop,
      GameActorTypes.Knight,
      GameActorTypes.Rook,
    ];
    // Set black pieces
    emptyBoard[0] = backRowOrder.map((type) => ({ team: "black", type }));
    emptyBoard[1] = Array(8).fill({ team: "black", type: GameActorTypes.Pawn });

    // Set white pieces
    emptyBoard[6] = Array(8).fill({ team: "white", type: GameActorTypes.Pawn });
    emptyBoard[7] = backRowOrder.map((type) => ({ team: "white", type }));

    return emptyBoard;
  }
}
