import { UsersDao } from './users.dao';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersDao],
  exports: [UsersService],
})
export class UsersModule {}
