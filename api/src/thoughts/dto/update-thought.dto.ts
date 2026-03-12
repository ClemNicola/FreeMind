import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { MoodEnum, TimeEnum } from '../../generated/prisma/client';

export class UpdateThoughtDto {
  @IsOptional()
  @IsString()
  current?: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  trigger?: string;

  @IsOptional()
  @IsEnum(TimeEnum)
  time?: TimeEnum;

  @IsOptional()
  @IsBoolean()
  legitimate?: boolean;

  @IsOptional()
  @IsEnum(MoodEnum)
  mood?: MoodEnum;
}
