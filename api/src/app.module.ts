import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ThoughtsModule } from './thoughts/thoughts.module';

@Module({
  imports: [PrismaModule, ThoughtsModule],
})
export class AppModule {}
