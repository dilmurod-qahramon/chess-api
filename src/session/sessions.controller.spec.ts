import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./services/session.service";
import { SessionsController } from "./sessions.controller";

describe("SessionController", () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [SessionService],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
