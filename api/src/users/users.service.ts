import { Injectable } from '@nestjs/common';
import type { User } from '../generated/prisma/client';
import { UsersDao } from './users.dao';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersDao: UsersDao) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersDao.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersDao.findById(id);
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.usersDao.create(dto);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.usersDao.update(id, data);
  }
}
