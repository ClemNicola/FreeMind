import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateThoughtDto {
  @IsString()
  @ApiProperty()
  ciphertext: string;

  @IsString()
  @ApiProperty()
  iv: string;

  @IsString()
  @ApiProperty()
  authTag: string;

  @IsString()
  @ApiProperty()
  timeIndex: string;

  @IsString()
  @ApiProperty()
  legitimateIndex: string;

  @IsString()
  @ApiProperty()
  moodIndex: string;
}
