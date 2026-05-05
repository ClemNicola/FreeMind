import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';

@Injectable()
export class ThoughtsDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(
    userId: string,
    filters: FilterThoughtDto = {},
    cursor?: string,
    take: number = 20,
  ) {
    const items = await this.prisma.thought.findMany({
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      where: {
        userId,
        ...(filters.moodIndex && {
          moodIndex: filters.moodIndex,
        }),
        ...(filters.timeIndex && {
          timeIndex: filters.timeIndex,
        }),
        ...(filters.legitimateIndex && {
          legitimateIndex: filters.legitimateIndex,
        }),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const hasNext = items.length > take;
    const data = hasNext ? items.slice(0, take) : items;
    const nextCursor = hasNext ? data[data.length - 1].id : null;

    return { data, nextCursor };
  }

  findById(id: string) {
    return this.prisma.thought.findUnique({
      where: { id },
    });
  }

  create(userId: string, data: CreateThoughtDto) {
    return this.prisma.thought.create({
      data: {
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: undefined,
      },
    });
  }

  update(id: string, data: UpdateThoughtDto) {
    return this.prisma.thought.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  delete(id: string) {
    return this.prisma.thought.delete({ where: { id } });
  }
}
