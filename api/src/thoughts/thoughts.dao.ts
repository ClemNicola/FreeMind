import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';

@Injectable()
export class ThoughtsDao {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUserId(userId: string, filters: FilterThoughtDto = {}) {
    return this.prisma.thought.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.thought.findUnique({
      where: { id },
    });
  }

  create(userId: string, data: CreateThoughtDto) {
    console.log('userId', userId);
    console.log('data', data);
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
