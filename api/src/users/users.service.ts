import { Injectable } from '@nestjs/common';
import { UsersDao } from './users.dao';

@Injectable()
export class UsersService {
  constructor(private readonly usersDao: UsersDao) {}

  async findByEmail(email: string) {
    return this.usersDao.findByEmail(email);
  }

  async findById(id: string) {
    return this.usersDao.findById(id);
  }
}
