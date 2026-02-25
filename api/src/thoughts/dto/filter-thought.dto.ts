import { MoodEnum, TimeEnum } from '../../generated/prisma/client';

export class FilterThoughtDto {
  mood?: MoodEnum;
  time?: TimeEnum;
  legitimate?: boolean;
}
