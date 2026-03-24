import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from 'src/generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes } from 'node:crypto';

@Injectable()
export class UsersDao {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        salt: randomBytes(16).toString('hex'),
        wrappedMasterKey: dto.wrappedMasterKey,
        seedPhraseHash: dto.seedPhraseHash,
      },
    });
  }

  async update(id: string, data: Partial<User>) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
