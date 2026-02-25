import { Injectable, NotFoundException } from '@nestjs/common';
import { ThoughtsDao } from './thoughts.dao';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { FilterThoughtDto } from './dto/filter-thought.dto';

@Injectable()
export class ThoughtsService {
  constructor(private readonly thoughtsDao: ThoughtsDao) {}

  findAll(userId: string, filters: FilterThoughtDto = {}) {
    return this.thoughtsDao.findAllByUserId(userId, filters);
  }

  async findOne(id: string, userId: string) {
    const thought = await this.thoughtsDao.findById(id);
    if (!thought || thought.userId !== userId) {
      throw new NotFoundException(`Thought ${id} not found`);
    }
    return thought;
  }

  create(userId: string, dto: CreateThoughtDto) {
    return this.thoughtsDao.create(userId, dto);
  }

  async update(id: string, userId: string, dto: UpdateThoughtDto) {
    await this.findOne(id, userId);
    return this.thoughtsDao.update(id, dto);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.thoughtsDao.delete(id);
  }
}
