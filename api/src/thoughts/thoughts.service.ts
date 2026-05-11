import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { Thought } from '../generated/prisma/client';
import { ThoughtsDao } from './thoughts.dao';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';
import { StatsThoughtDto } from './dto/stats-thought.dto';

@Injectable()
export class ThoughtsService {
  constructor(private readonly thoughtsDao: ThoughtsDao) {}

  async findAll(
    userId: string,
    filters: FilterThoughtDto = {},
    cursor?: string,
    take: number = 20,
  ): Promise<{ data: Thought[]; nextCursor: string | null }> {
    return this.thoughtsDao.findAllByUserId(userId, filters, cursor, take);
  }

  async findOne(id: string, userId: string): Promise<Thought> {
    const thought = await this.thoughtsDao.findById(id);
    if (!thought || thought.userId !== userId) {
      throw new NotFoundException(`Thought ${id} not found`);
    }
    return thought;
  }

  async create(userId: string, dto: CreateThoughtDto): Promise<Thought> {
    return this.thoughtsDao.create(userId, dto);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateThoughtDto,
  ): Promise<Thought> {
    const thought = await this.findOne(id, userId);
    if (thought.userId !== userId) {
      throw new ForbiddenException(`Thought ${id} not found`);
    }
    return this.thoughtsDao.update(id, dto);
  }

  async remove(id: string, userId: string): Promise<Thought> {
    const thought = await this.findOne(id, userId);
    if (thought.userId !== userId) {
      throw new ForbiddenException(`Thought ${id} not found`);
    }
    return this.thoughtsDao.delete(id);
  }

  async dataStats(
    userId: string,
    range: '7d' | '30d' | 'all',
  ): Promise<StatsThoughtDto> {
    const startDate = this.startDateFromDateRange(range);
    return this.thoughtsDao.dataStats(userId, startDate);
  }

  private startDateFromDateRange(
    range: '7d' | '30d' | 'all',
  ): Date | undefined {
    if (range === 'all') return undefined;
    const now = new Date();
    const days = range === '7d' ? 7 : 30;
    now.setDate(now.getDate() - days);
    return now;
  }
}
