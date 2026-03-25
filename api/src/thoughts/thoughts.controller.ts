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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ThoughtsService } from './thoughts.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = Request & { user: { sub: string; email: string } };

@ApiTags('Thoughts')
@ApiBearerAuth()
@Controller('thoughts')
export class ThoughtsController {
  constructor(private readonly thoughtsService: ThoughtsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all thoughts successful',
  })
  @ApiQuery({ name: 'moodIndex', required: false })
  @ApiQuery({ name: 'timeIndex', required: false })
  @ApiQuery({ name: 'legitimateIndex', required: false })
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query() filters: FilterThoughtDto,
  ) {
    return this.thoughtsService.findAll(req.user.sub, filters);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get thought successful',
  })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.thoughtsService.findOne(id, req.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create thought successful',
  })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateThoughtDto) {
    return this.thoughtsService.create(req.user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update thought successful',
  })
  update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateThoughtDto,
  ) {
    return this.thoughtsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete thought successful',
  })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.thoughtsService.remove(id, req.user.sub);
  }
}
