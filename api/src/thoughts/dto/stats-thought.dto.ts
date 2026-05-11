import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject } from 'class-validator';

export class StatsThoughtDto {
  @ApiProperty()
  @IsNumber()
  totalThoughts: number;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  totalMood: { moodIndex: string; _count: number }[];

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  totalLegitimate: { legitimateIndex: string; _count: number }[];

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  totalTime: { timeIndex: string; _count: number }[];

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  totalThoughtsByDay: { day: string; count: number }[];
}
