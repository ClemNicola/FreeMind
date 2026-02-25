import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

//ajouter les types certainement avec zod

@Injectable()
export class UsersDao {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
