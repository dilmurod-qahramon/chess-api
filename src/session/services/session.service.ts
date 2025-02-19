import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateSessionDto } from "../dto/create-session.dto";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";
import { UUID } from "crypto";
import { GameFieldState } from "src/interfaces/GameFieldState.type";
import { UpdateSessionDto } from "../dto/update-session.dto";
import { GameTurn } from "src/models/game-turn.model";
import { GameTurnActions } from "src/interfaces/GameTurnAction.type";
import {
  CHESS_BOARD_SIZE,
  DEFAULT_GAME_FIELD,
  ONE_SECOND,
} from "src/constants";
import { Sequelize } from "sequelize";
import { SessionDto } from "../dto/session.dto";
import { PlayerService } from "src/player/services/player.service";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(GameSession)
    private readonly gameSessionModel: typeof GameSession,
    @InjectModel(GameTurn)
    private readonly gameTurnModel: typeof GameTurn,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly playerService: PlayerService,
  ) {}

  async createNewSession(createSessionDto: CreateSessionDto) {
    const session = await this.gameSessionModel.create({
      leftPlayerId: createSessionDto.leftPlayerId,
      rightPlayerId: createSessionDto.rightPlayerId,
      turnDuration: 60,
      nextTurnEndAt: new Date(),
      fieldState: DEFAULT_GAME_FIELD,
    });

    return session.id;
  }

  async findBySessionId(sessionId: UUID) {
    const session = await this.gameSessionModel.findByPk(sessionId);
    if (session == null) {
      throw new NotFoundException("Invalid session id!");
    }

    return new SessionDto(session.dataValues);
  }

  async addNewActionsToTheSession(
    updateSessionDto: UpdateSessionDto,
    sessionId: UUID,
  ) {
    const session = await this.findBySessionId(sessionId);
    if (!session || session.completedAt) {
      throw new BadRequestException(
        "Invalid session id or session is complted!",
      );
    }
    const playerId =
      session.currentTurn == "left"
        ? session.leftPlayerId
        : session.rightPlayerId;

    try {
      const result = await this.sequelize.transaction(async (t) => {
        this.gameTurnModel.create({
          gameSessionId: session.id,
          playerId: playerId,
          actions: updateSessionDto.actions,
        });

        const newFieldState = this.updateFieldState(
          session.fieldState,
          updateSessionDto.actions,
          session.currentTurn,
        );

        this.gameSessionModel.update(
          {
            currentTurn: session.currentTurn === "left" ? "right" : "left",
            fieldState: newFieldState,
            nextTurnEndAt: new Date(
              session!.createdAt.getTime() + session.turnDuration * ONE_SECOND,
            ),
          },
          {
            where: {
              id: session.id,
            },
          },
        );

        return new SessionDto(await this.findBySessionId(session.id));
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Transacion failed and rolled back.");
    }
  }

  private updateFieldState(
    fieldState: GameFieldState,
    actions: GameTurnActions,
    currentTurn: "left" | "right",
  ): GameFieldState {
    const [moveAction, swapAction, upgradeAction] = actions;
    const turn = currentTurn == "left" ? "white" : "black";

    if (moveAction && upgradeAction) {
      const oldPlaceCol = moveAction.oldPlace.charCodeAt(0) - "a".charCodeAt(0);
      const oldPlaceRow = CHESS_BOARD_SIZE - Number(moveAction.oldPlace[1]);
      const newPlaceCol = moveAction.newPlace.charCodeAt(0) - "a".charCodeAt(0);
      const newPlaceRow = CHESS_BOARD_SIZE - Number(moveAction.newPlace[1]);
      const oldCell = fieldState[oldPlaceRow][oldPlaceCol];
      if (oldCell !== null && turn == oldCell.team) {
        oldCell.type = upgradeAction.toType;
        fieldState[oldPlaceRow][oldPlaceCol] = null;
        fieldState[newPlaceRow][newPlaceCol] = oldCell;
      } else {
        throw new Error("cell is empty or can't play with opponent's piece!");
      }
    } else if ((moveAction && !swapAction) || (!moveAction && swapAction)) {
      if (moveAction) {
        const oldPlaceCol =
          moveAction.oldPlace.charCodeAt(0) - "a".charCodeAt(0);
        const oldPlaceRow = CHESS_BOARD_SIZE - Number(moveAction.oldPlace[1]);
        const newPlaceCol =
          moveAction.newPlace.charCodeAt(0) - "a".charCodeAt(0);
        const newPlaceRow = CHESS_BOARD_SIZE - Number(moveAction.newPlace[1]);
        const oldCell = fieldState[oldPlaceRow][oldPlaceCol];
        if (oldCell !== null && oldCell.team == turn) {
          fieldState[oldPlaceRow][oldPlaceCol] = null;
          fieldState[newPlaceRow][newPlaceCol] = oldCell;
        } else {
          throw new Error("cell is empty or can't play with opponent's piece!");
        }
      } else if (swapAction) {
        //not implemented yet ..............
      } else {
        throw new Error("Not allowed pair of actions!!");
      }
    }

    return fieldState;
  }
}
