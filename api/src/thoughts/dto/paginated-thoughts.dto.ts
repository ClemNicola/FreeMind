import { ApiProperty } from '@nestjs/swagger';
import { ThoughtDto } from './thought.dto';

export class PaginatedThoughtsDto {
  @ApiProperty({ type: [ThoughtDto] })
  data: ThoughtDto[];

  @ApiProperty({
    type: String,
    nullable: true,
    description:
      'Cursor to pass back to fetch the next page. `null` when no more results are available.',
  })
  nextCursor: string | null;
}
