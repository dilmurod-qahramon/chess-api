import { Injectable } from "@nestjs/common";
import { CreateSessionDto } from "../dto/create-session.dto";
import { InjectModel } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";
import { UUID } from "crypto";
import { GameFieldState } from "src/interfaces/GameFieldState.type";
import { GameActorTypes } from "src/interfaces/GameActorTypes.enum";
import { SessionDto } from "../dto/session.dto";
import { UpdateSessionDto } from "../dto/update-session.dto";
import { GameTurn } from "src/models/game-turn.model";
import { GameTurnActions } from "src/interfaces/GameTurnAction.type";

@Injectable()
export class SessionService {
  private static readonly DEFAULT_GAME_FIELD: GameFieldState = [
    [
      { team: "black", type: GameActorTypes.Rook },
      { team: "black", type: GameActorTypes.Knight },
      { team: "black", type: GameActorTypes.Bishop },
      { team: "black", type: GameActorTypes.Queen },
      { team: "black", type: GameActorTypes.King },
      { team: "black", type: GameActorTypes.Bishop },
      { team: "black", type: GameActorTypes.Knight },
      { team: "black", type: GameActorTypes.Rook },
    ],
    [
      { team: "black", type: GameActorTypes.Pawn },
      { team: "black", type: GameActorTypes.Pawn },
      { team: "black", type: GameActorTypes.Pawn },
      { team: "black", type: GameActorTypes.Pawn },
      { team: "black", type: GameActorTypes.Pawn },
      { team: "black", type: GameActorTypes.Pawn },
      { team: "black", type: GameActorTypes.Pawn },
      { team: "black", type: GameActorTypes.Pawn },
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      { team: "white", type: GameActorTypes.Pawn },
      { team: "white", type: GameActorTypes.Pawn },
      { team: "white", type: GameActorTypes.Pawn },
      { team: "white", type: GameActorTypes.Pawn },
      { team: "white", type: GameActorTypes.Pawn },
      { team: "white", type: GameActorTypes.Pawn },
      { team: "white", type: GameActorTypes.Pawn },
      { team: "white", type: GameActorTypes.Pawn },
    ],
    [
      { team: "white", type: GameActorTypes.Rook },
      { team: "white", type: GameActorTypes.Knight },
      { team: "white", type: GameActorTypes.Bishop },
      { team: "white", type: GameActorTypes.Queen },
      { team: "white", type: GameActorTypes.King },
      { team: "white", type: GameActorTypes.Bishop },
      { team: "white", type: GameActorTypes.Knight },
      { team: "white", type: GameActorTypes.Rook },
    ],
  ];

  constructor(
    @InjectModel(GameSession)
    private readonly gameSessionModel: typeof GameSession,
    @InjectModel(GameTurn)
    private readonly gameTurnModel: typeof GameTurn,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const session = await this.gameSessionModel.create({
      leftPlayerId: createSessionDto.leftPlayerId,
      rightPlayerId: createSessionDto.rightPlayerId,
      nextTurnEndAt: new Date(),
      fieldState: SessionService.DEFAULT_GAME_FIELD,
    });

    const dto: SessionDto = {
      id: session.id,
      fieldState: session.fieldState,
    };

    return dto;
  }

  async findBySessionId(sessionId: UUID) {
    const session = await this.gameSessionModel.findByPk(sessionId);
    if (session == null) {
      return null;
    }
    const dto: SessionDto = {
      id: session.id,
      fieldState: session.fieldState,
    };

    return dto;
  }

  async createNewActionsAndUpdateGameFieldState(
    sessionId: UUID,
    updateSessionDto: UpdateSessionDto,
  ) {
    const session = await this.gameSessionModel.findByPk(sessionId);

    //check if player is active in this session and session is not completed
    if (
      session &&
      !session.completedAt &&
      (session.leftPlayerId == updateSessionDto.playerId ||
        session.rightPlayerId == updateSessionDto.playerId) &&
      this.validateActions(updateSessionDto.actions)
    ) {
      //if successfull, validate the move
      this.gameTurnModel.create({
        gameSessionId: sessionId,
        paleyerId: updateSessionDto.playerId,
        actions: updateSessionDto.actions,
      });
    }
  }

  validateActions(actions: GameTurnActions): boolean {
    const [moveAction, swapAction, ugradeAction] = actions;
    if (moveAction && ugradeAction) {
      this.canMove(moveAction.oldPlace, moveAction.newPlace);
      return true;
    } else if (moveAction || swapAction) {
      return true;
    }

    return false;
  }
  private canMove(oldPlace: [], newPlace: []) {}
}
