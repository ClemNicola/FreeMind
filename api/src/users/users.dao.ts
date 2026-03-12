import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
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

  async create(email: string, password: string) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        salt: await this.generateSalt(),
        seedPhraseHash: await this.generateSeedPhraseHash(),
        refreshToken: null,
        emailVerified: false,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, data: Partial<User>) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  generateSalt(): Promise<string> {
    return Promise.resolve(randomBytes(16).toString('hex'));
  }

  async generateSeedPhraseHash(): Promise<string> {
    return Promise.resolve(randomBytes(32).toString('hex'));
  }
}
