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

@Injectable()
export class ThoughtsService {
  constructor(private readonly thoughtsDao: ThoughtsDao) {}

  async findAll(
    userId: string,
    filters: FilterThoughtDto = {},
  ): Promise<Thought[]> {
    return this.thoughtsDao.findAllByUserId(userId, filters);
  }

  async findOne(id: string, userId: string): Promise<Thought> {
    const thought = await this.thoughtsDao.findById(id);
    if (!thought || thought.userId !== userId) {
      throw new NotFoundException(`Thought ${id} not found`);
    }
    return thought;
  }

  async create(userId: string, dto: CreateThoughtDto): Promise<Thought> {
    console.log('userId', userId);
    console.log('dto', dto);
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
}
