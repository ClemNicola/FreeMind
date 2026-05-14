import { ApiProperty } from '@nestjs/swagger';

export class MoodCountDto {
  @ApiProperty()
  moodIndex: string;

  @ApiProperty()
  _count: number;
}

export class LegitimateCountDto {
  @ApiProperty()
  legitimateIndex: string;

  @ApiProperty()
  _count: number;
}

export class TimeCountDto {
  @ApiProperty()
  timeIndex: string;

  @ApiProperty()
  _count: number;
}

export class DayCountDto {
  @ApiProperty()
  day: string;

  @ApiProperty()
  count: number;
}

export class StatsThoughtDto {
  @ApiProperty()
  totalThoughts: number;

  @ApiProperty({ type: [MoodCountDto] })
  totalMood: MoodCountDto[];

  @ApiProperty({ type: [LegitimateCountDto] })
  totalLegitimate: LegitimateCountDto[];

  @ApiProperty({ type: [TimeCountDto] })
  totalTime: TimeCountDto[];

  @ApiProperty({ type: [DayCountDto] })
  totalThoughtsByDay: DayCountDto[];

  @ApiProperty()
  streak: number;
}
