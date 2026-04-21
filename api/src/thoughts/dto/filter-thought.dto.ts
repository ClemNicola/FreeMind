import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterThoughtDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  moodIndex?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  timeIndex?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  legitimateIndex?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  createdAt?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty({ required: false, default: 20 })
  take?: number;
}
