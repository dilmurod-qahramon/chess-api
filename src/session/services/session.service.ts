import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateSessionDto } from "../dto/create-session.dto";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";
import { GameFieldState } from "src/types/GameFieldState.type";
import { UpdateSessionDto } from "../dto/update-session.dto";
import { GameTurnActions } from "src/types/GameTurnAction.type";
import {
  CHESS_BOARD_SIZE,
  DEFAULT_GAME_FIELD,
  ONE_SECOND,
} from "src/constants";
import { Sequelize } from "sequelize";
import { Player } from "src/models/player.model";
import { GameTurnService } from "./game-turn.service";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(GameSession)
    private readonly gameSessionModel: typeof GameSession,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private gameTurnService: GameTurnService,
  ) {}

  findBySessionId(sessionId: string) {
    return this.gameSessionModel.findByPk(sessionId);
  }

  getAllSessions() {
    return this.gameSessionModel.findAll({
      include: [
        { model: Player, as: "leftPlayer" },
        { model: Player, as: "rightPlayer" },
      ],
    });
  }

  finishSession(sessionId: string) {
    return this.gameSessionModel.update(
      {
        completedAt: new Date(),
      },
      {
        where: {
          id: sessionId,
        },
      },
    );
  }

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

  async addNewActionsToTheSession(
    updateSessionDto: UpdateSessionDto,
    session: GameSession,
  ) {
    const playerId =
      session.currentTurn == "left"
        ? session.leftPlayerId
        : session.rightPlayerId;

    try {
      const result = await this.sequelize.transaction(async (t) => {
        await this.gameTurnService.createNewGameTurn(
          session.id,
          playerId,
          updateSessionDto.actions,
          t,
        );

        const newFieldState = this.updateFieldState(
          session.fieldState,
          updateSessionDto.actions,
          session.currentTurn,
        );

        const updatedSession = await this.gameSessionModel.update(
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
            transaction: t,
            returning: true,
          },
        );

        return updatedSession[1][0];
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Transacion failed and rolled back.");
    }
  }

  async deleteSessionById(sessionId: string) {
    await this.gameSessionModel.destroy({ where: { id: sessionId } });
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
        throw new BadRequestException(
          "cell is empty or can't play with opponent's piece!",
        );
      }
    } else if ((moveAction && !swapAction) || (!moveAction && swapAction)) {
      if (moveAction) {
        const oldCellCol =
          moveAction.oldPlace.charCodeAt(0) - "a".charCodeAt(0);
        const oldCellRow = CHESS_BOARD_SIZE - Number(moveAction.oldPlace[1]);
        const newCellCol =
          moveAction.newPlace.charCodeAt(0) - "a".charCodeAt(0);
        const newCellRow = CHESS_BOARD_SIZE - Number(moveAction.newPlace[1]);
        const oldCell = fieldState[oldCellRow][oldCellCol];
        if (oldCell !== null && oldCell.team == turn) {
          fieldState[oldCellRow][oldCellCol] = null;
          fieldState[newCellRow][newCellCol] = oldCell;
        } else {
          throw new BadRequestException(
            "cell is empty or can't play with opponent's piece!",
          );
        }
      } else if (swapAction) {
        //not implemented yet ..............
      } else {
        throw new BadRequestException("Not allowed pair of actions!!");
      }
    }

    return fieldState;
  }
}
