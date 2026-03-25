import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsString()
  @MinLength(32)
  @ApiProperty()
  wrappedMasterKey: string;

  @IsString()
  @ApiProperty()
  seedPhraseHash: string;
}
