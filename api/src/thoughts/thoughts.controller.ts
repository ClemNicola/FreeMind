import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { ThoughtsService } from './thoughts.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';

@Controller('thoughts')
export class ThoughtsController {
  constructor(private readonly thoughtsService: ThoughtsService) {}

  @Get()
  findAll(
    @Headers('x-user-id') userId: string,
    @Query() filters: FilterThoughtDto,
  ) {
    return this.thoughtsService.findAll(userId, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.thoughtsService.findOne(id, userId);
  }

  @Post()
  create(@Headers('x-user-id') userId: string, @Body() dto: CreateThoughtDto) {
    return this.thoughtsService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: UpdateThoughtDto,
  ) {
    return this.thoughtsService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.thoughtsService.remove(id, userId);
  }
}
