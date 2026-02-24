import { MoodEnum, TimeEnum } from '../../generated/prisma/client';

export class UpdateThoughtDto {
  current?: string;
  context?: string;
  trigger?: string;
  time?: TimeEnum;
  legitimate?: boolean;
  mood?: MoodEnum;
}
