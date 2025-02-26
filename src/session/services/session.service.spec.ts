import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./session.service";

describe("SessionService", () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("addNewActionsToTheSession", () => {
    it("should be implemented when it is completed", async () => {
      expect("not implemeted").toBe("implemeted");
    });
  });
});
