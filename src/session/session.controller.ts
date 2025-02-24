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
  Patch,
  HttpCode,
} from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UUID } from "crypto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { PlayerService } from "src/player/services/player.service";
import { SessionDto } from "./dto/session.dto";

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
  async findBySessionId(@Param("sessionId") sessionId: UUID) {
    return new SessionDto(await this.sessionService.findBySessionId(sessionId));
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

    return new SessionDto(updatedSession);
  }

  @Patch(":sessionId")
  @HttpCode(204)
  finishTheSession(@Param("sessionId") sessionId: UUID) {
    return this.sessionService.finishSession(sessionId);
  }
}
