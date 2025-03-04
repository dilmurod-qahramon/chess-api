import { GameActorTypes } from "src/types/GameActorTypes.enum";
import { GameFieldState } from "src/types/GameFieldState.type";

export const jwtConstants = {
  secret: "Very long and secure secret key should be here",
};

export const CHESS_BOARD_SIZE = 8;
export const ONE_SECOND = 1000;
export const ACCESS_TOKEN_EXP = "10h"; //'10h'
export const REFRESH_TOKEN_EXP = "7d"; // a week
export const DEFAULT_GAME_FIELD: GameFieldState = [
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
