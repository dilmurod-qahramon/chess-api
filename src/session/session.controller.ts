import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  InternalServerErrorException,
} from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UUID } from "crypto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { PlayerService } from "src/player/services/player.service";

@Controller("sessions")
@UseInterceptors(ClassSerializerInterceptor)
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly playerService: PlayerService,
  ) {}

  @Post()
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const player1 = await this.playerService.findByPlayerId(
      createSessionDto.leftPlayerId as UUID,
    );
    const player2 = await this.playerService.findByPlayerId(
      createSessionDto.rightPlayerId as UUID,
    );

    if (
      !player1 ||
      !player2 ||
      createSessionDto.leftPlayerId == createSessionDto.rightPlayerId
    ) {
      throw new BadRequestException("Invalid player id!");
    }

    return this.sessionService.createNewSession(createSessionDto);
  }

  @Get(":sessionId")
  findBySessionId(@Param("sessionId") sessionId: UUID) {
    return this.sessionService.findBySessionId(sessionId);
  }

  @Post(":sessionId/actions")
  async addActionsToSession(
    @Param("sessionId") sessionId: UUID,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    const updatedSession = await this.sessionService.addNewActionsToTheSession(
      updateSessionDto,
      sessionId,
    );

    if (updatedSession == null) {
      throw new InternalServerErrorException();
    }

    return updatedSession;
  }
}
