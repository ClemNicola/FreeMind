import { TimeEnum, MoodEnum } from '../../generated/prisma/client';

export class CreateThoughtDto {
  current: string;
  context: string;
  trigger: string;
  time: TimeEnum;
  legitimate: boolean;
  mood: MoodEnum;
}
