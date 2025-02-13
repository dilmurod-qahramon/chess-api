import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UUID } from "crypto";
import { UpdateSessionDto } from "./dto/update-session.dto";

@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    //return session.dto
    return await this.sessionService.create(createSessionDto);
  }

  @Get(":sessionId")
  findBySessionId(@Param("sessionId") sessionId: UUID) {
    //return session.dto
    return this.sessionService.findBySessionId(sessionId);
  }

  @Post(":sessionId/actions")
  updateSessionActions(
    @Param("sessionId") sessionId: UUID,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    //add new turn and update session fieldState
    return this.sessionService.createNewActionsAndUpdateGameFieldState(
      sessionId,
      updateSessionDto,
    );
  }
}
