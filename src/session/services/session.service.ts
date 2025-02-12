import { Injectable } from "@nestjs/common";
import { CreateSessionDto } from "../dto/create-session.dto";
import { InjectModel } from "@nestjs/sequelize";
import {
  GameActorTypes,
  GameFieldState,
  GameSession,
} from "src/models/game-session.model";
import { UUID } from "crypto";
import { UpdateSessionDto } from "../dto/update-session.dto";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(GameSession)
    private readonly gameSessionModel: typeof GameSession,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    return this.gameSessionModel.create({
      leftPlayerId: createSessionDto.leftPlayerId,
      rightPlayerId: createSessionDto.rightPlayerId,
      turnDuration: createSessionDto.turnDuration ?? 60,
      nextTurnEndAt: new Date(),
      fieldState: this.initBoard(),
    });
  }

  findById(id: UUID) {
    return this.gameSessionModel.findByPk(id);
  }

  async update(id: UUID, updateSessionDto: UpdateSessionDto) {
    const session = await this.findById(id);
    const newFieldState = this.updateFieldState(
      updateSessionDto.moveFrom,
      updateSessionDto.moveTo,
      session?.fieldState,
    );
    await this.gameSessionModel.update(
      {
        nextTurnForPlayer: updateSessionDto.nextTurnForPlayer,
        fieldState: newFieldState,
        turnDuration: updateSessionDto.turnDuration ?? 60,
        nextTurnEndAt: new Date(
          session!.createdAt.getTime() + updateSessionDto.turnDuration * 1000,
        ),
      },
      {
        where: {
          id,
        },
      },
    );
    return session;
  }

  // remove(id: UUID) {
  //   return this.gameSessionModel.destroy({ where: { id } });
  // }

  private updateFieldState(
    moveFrom: string,
    moveTo: string,
    fieldState?: GameFieldState,
  ) {
    if (fieldState) {
      const newFieldState = fieldState.map((row) => [...row]);

      const moveFromCol = moveFrom.charCodeAt(0) - "a".charCodeAt(0);
      const moveFromRow = 8 - Number(moveFrom[1]);
      const moveToCol = moveTo.charCodeAt(0) - "a".charCodeAt(0);
      const moveToRow = 8 - Number(moveTo[1]);

      const cell = fieldState[moveFromRow][moveFromCol];
      if (cell !== null) {
        newFieldState[moveFromRow][moveFromCol] = null;
        newFieldState[moveToRow][moveToCol] = cell;
      }
      return newFieldState;
    }
  }

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
