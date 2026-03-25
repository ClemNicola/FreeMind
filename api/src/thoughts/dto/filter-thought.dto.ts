import { IsOptional, IsString } from 'class-validator';
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
}
