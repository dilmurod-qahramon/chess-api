import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./session.service";
import { getModelToken } from "@nestjs/sequelize";
import { GameSession } from "src/models/game-session.model";
import { GameTurnService } from "./game-turn.service";
import { Sequelize } from "sequelize";

describe("SessionService", () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: GameTurnService, useValue: {} },
        { provide: Sequelize, useValue: {} },
        { provide: getModelToken(GameSession), useValue: {} },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  // it("should be defined", () => {
  //   // expect(service).toBeDefined();
  // });

  // describe("addNewActionsToTheSession", () => {
  //   // it("should be implemented when it is completed", async () => {
  //   //   expect("not implemeted").toBe("implemeted");
  //   // });
  // });
});
