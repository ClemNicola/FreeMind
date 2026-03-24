import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ThoughtsModule } from './thoughts/thoughts.module';

@Module({
  imports: [PrismaModule, AuthModule, ThoughtsModule],
})
export class AppModule {}
