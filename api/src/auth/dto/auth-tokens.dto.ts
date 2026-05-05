import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  wrappedMasterKey: string;

  @ApiProperty()
  salt: string;
}
