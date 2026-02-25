import { Module } from '@nestjs/common';
import { ThoughtsController } from './thoughts.controller';
import { ThoughtsService } from './thoughts.service';
import { ThoughtsDao } from './thoughts.dao';

@Module({
  controllers: [ThoughtsController],
  providers: [ThoughtsService, ThoughtsDao],
})
export class ThoughtsModule {}
