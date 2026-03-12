import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { TimeEnum, MoodEnum } from '../../generated/prisma/client';

export class CreateThoughtDto {
  @IsString()
  current: string;

  @IsString()
  context: string;

  @IsString()
  trigger: string;

  @IsEnum(TimeEnum)
  time: TimeEnum;

  @IsBoolean()
  legitimate: boolean;

  @IsEnum(MoodEnum)
  mood: MoodEnum;
}
