import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
} from '@nestjs/common';
import { ThoughtsService } from './thoughts.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

type AuthenticatedRequest = Request & { user: { sub: string; email: string } };

@Controller('thoughts')
export class ThoughtsController {
  constructor(private readonly thoughtsService: ThoughtsService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query() filters: FilterThoughtDto,
  ) {
    return this.thoughtsService.findAll(req.user.sub, filters);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.thoughtsService.findOne(id, req.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateThoughtDto) {
    return this.thoughtsService.create(req.user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateThoughtDto,
  ) {
    return this.thoughtsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.thoughtsService.remove(id, req.user.sub);
  }
}
