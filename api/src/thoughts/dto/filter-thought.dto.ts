import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { MoodEnum, TimeEnum } from '../../generated/prisma/client';

export class FilterThoughtDto {
  @IsOptional()
  @IsEnum(MoodEnum)
  mood?: MoodEnum;

  @IsOptional()
  @IsEnum(TimeEnum)
  time?: TimeEnum;

  @IsOptional()
  @IsBoolean()
  legitimate?: boolean;
}
