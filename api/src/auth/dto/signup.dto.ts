import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  salt: string;

  @IsString()
  @ApiProperty()
  wrappedMasterKey: string;

  @IsString()
  @ApiProperty()
  seedPhraseHash: string;
}
