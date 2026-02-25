import { Injectable } from '@nestjs/common';
import type { MoodEnum, TimeEnum } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';

type ThoughtsWhereFilter = {
  userId: string;
  mood?: MoodEnum;
  time?: TimeEnum;
  legitimate?: boolean;
};

@Injectable()
export class ThoughtsDao {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUserId(userId: string, filters: FilterThoughtDto = {}) {
    const where: ThoughtsWhereFilter = {
      userId,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (filters.mood) where.mood = filters.mood;
    if (filters.time) where.time = filters.time;
    if (filters.legitimate !== undefined) where.legitimate = filters.legitimate;

    return this.prisma.thought.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.thought.findUnique({ where: { id } });
  }

  create(userId: string, data: CreateThoughtDto) {
    return this.prisma.thought.create({
      data: { ...data, userId },
    });
  }

  update(id: string, data: UpdateThoughtDto) {
    return this.prisma.thought.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.thought.delete({ where: { id } });
  }
}
