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
    const stats = await this.thoughtsDao.dataStats(userId, startDate);
    const allDays = await this.thoughtsDao.thoughtsByDay(userId);
    const streak = this.computeDayStreak(allDays);
    return { ...stats, streak };
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

  private computeDayStreak(
    thoughtsByDay: { day: string; count: number }[],
  ): number {
    const daySet = new Set(
      thoughtsByDay.map((t) => String(t.day).split('T')[0]),
    );
    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    while (true) {
      const key = currentDate.toISOString().split('T')[0];
      if (!daySet.has(key)) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  }
}
