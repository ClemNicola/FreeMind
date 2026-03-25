import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateThoughtDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  ciphertext?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  iv?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  authTag?: string;

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
  moodIndex?: string;
}
