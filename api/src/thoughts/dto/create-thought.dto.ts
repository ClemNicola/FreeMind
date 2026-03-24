import { IsString } from 'class-validator';

export class CreateThoughtDto {
  @IsString()
  ciphertext: string;

  @IsString()
  iv: string;

  @IsString()
  authTag: string;

  @IsString()
  timeIndex: string;

  @IsString()
  legitimateIndex: string;

  @IsString()
  moodIndex: string;
}
