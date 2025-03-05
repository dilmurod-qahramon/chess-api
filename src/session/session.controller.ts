import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  Patch,
  HttpCode,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UUID } from "crypto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { PlayerService } from "src/player/services/player.service";
import { SessionDto } from "./dto/session.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { RolesEnum } from "src/types/roles.enum";

@UseGuards(AuthGuard, RolesGuard)
@Controller("sessions")
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly playerService: PlayerService,
  ) {}

  @Get(":sessionId")
  @Roles(RolesEnum.Moderator, RolesEnum.Owner)
  async findBySessionId(@Param("sessionId") sessionId: UUID) {
    const session = await this.sessionService.findBySessionId(sessionId);
    if (session == null) {
      throw new NotFoundException("Invalid session id!");
    }

    return new SessionDto(session.dataValues);
  }

  @Get()
  @Roles(RolesEnum.Admin)
  async getAllSessions() {
    const sessions = await this.sessionService.getAllSessions();
    return sessions.map((session) => new SessionDto(session.dataValues));
  }

  @Post()
  @Roles(RolesEnum.Owner)
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

  @Post(":sessionId/actions")
  @Roles(RolesEnum.Owner)
  async addActionsToSession(
    @Param("sessionId") sessionId: UUID,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    const updatedSession = await this.sessionService.addNewActionsToTheSession(
      updateSessionDto,
      sessionId,
    );

    return new SessionDto(updatedSession.dataValues);
  }

  @Patch(":sessionId")
  @Roles(RolesEnum.Moderator, RolesEnum.Owner)
  @HttpCode(204)
  finishTheSession(@Param("sessionId") sessionId: UUID) {
    return this.sessionService.finishSession(sessionId);
  }
}
