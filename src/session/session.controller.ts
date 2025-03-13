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
  Delete,
} from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { PlayerService } from "src/player/services/player.service";
import { SessionDto } from "./dto/session.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { RolesEnum } from "src/types/roles.enum";
import { GameHistoryDto } from "./dto/game-history.dto";

@UseGuards(AuthGuard, RolesGuard)
@Controller("sessions")
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly playerService: PlayerService,
  ) {}

  @Get(":sessionId")
  @Roles(RolesEnum.Moderator, RolesEnum.Owner, RolesEnum.Admin)
  async findBySessionId(@Param("sessionId") sessionId: string) {
    const session = await this.sessionService.findBySessionId(sessionId);
    if (session == null) {
      throw new NotFoundException("Invalid session id!");
    }

    if (session.completedAt != null) {
      throw new BadRequestException("Session is already over!");
    }

    return new SessionDto(session.dataValues);
  }

  @Post()
  @Roles(RolesEnum.Owner, RolesEnum.Admin)
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const player1 = await this.playerService.findByPlayerId(
      createSessionDto.leftPlayerId,
    );
    const player2 = await this.playerService.findByPlayerId(
      createSessionDto.rightPlayerId,
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
  @Roles(RolesEnum.Owner, RolesEnum.Admin)
  async addActionsToSession(
    @Param("sessionId") sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    const session = await this.sessionService.findBySessionId(sessionId);
    if (!session || session.completedAt) {
      throw new BadRequestException(
        "Invalid session id or session is complted!",
      );
    }

    const updatedSession = await this.sessionService.addNewActionsToTheSession(
      updateSessionDto,
      session,
    );

    return new SessionDto(updatedSession.dataValues);
  }

  @Patch(":sessionId")
  @Roles(RolesEnum.Admin, RolesEnum.Owner)
  @HttpCode(204)
  finishTheSession(@Param("sessionId") sessionId: string) {
    return this.sessionService.finishSession(sessionId);
  }

  @Get()
  @Roles(RolesEnum.Admin)
  async getAllSessions() {
    const sessions = await this.sessionService.getAllSessions();
    return sessions.map(
      (session) =>
        new GameHistoryDto(
          session.id,
          session.leftPlayer.username,
          session.rightPlayer.username,
          session.createdAt,
          session.completedAt || null,
        ),
    );
  }

  @Delete(":sessionId")
  @Roles(RolesEnum.Admin)
  deleteASession(@Param("sessionId") sessionId: string) {
    return this.sessionService.deleteSessionById(sessionId);
  }
}
