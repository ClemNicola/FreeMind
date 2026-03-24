import { IsOptional, IsString } from 'class-validator';

export class FilterThoughtDto {
  @IsOptional()
  @IsString()
  moodIndex?: string;

  @IsOptional()
  @IsString()
  timeIndex?: string;

  @IsOptional()
  @IsString()
  legitimateIndex?: string;
}
