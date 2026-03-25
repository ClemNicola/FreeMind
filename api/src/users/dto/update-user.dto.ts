import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsString()
  @ApiProperty()
  password?: string;

  @IsString()
  @ApiProperty()
  wrappedMasterKey?: string;

  @IsString()
  @ApiProperty()
  refreshToken?: string;
}
