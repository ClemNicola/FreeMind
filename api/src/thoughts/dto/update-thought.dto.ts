import { IsOptional, IsString } from 'class-validator';

export class UpdateThoughtDto {
  @IsOptional()
  @IsString()
  ciphertext?: string;

  @IsOptional()
  @IsString()
  iv?: string;

  @IsOptional()
  @IsString()
  authTag?: string;

  @IsOptional()
  @IsString()
  timeIndex?: string;

  @IsOptional()
  @IsString()
  legitimateIndex?: string;

  @IsOptional()
  @IsString()
  moodIndex?: string;
}
