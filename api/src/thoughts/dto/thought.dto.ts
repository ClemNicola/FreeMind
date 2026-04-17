import { ApiProperty } from '@nestjs/swagger';

export class ThoughtDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ciphertext: string;

  @ApiProperty()
  iv: string;

  @ApiProperty()
  authTag: string;

  @ApiProperty()
  timeIndex: string;

  @ApiProperty()
  legitimateIndex: string;

  @ApiProperty()
  moodIndex: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
