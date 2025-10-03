import { ApiProperty } from '@nestjs/swagger';

export class ResponseAnalyticsDto {
  @ApiProperty({
    description: 'O valor atual do contador de acessos.',
    example: 42,
  })
  count: number;

  @ApiProperty({
    description: 'O identificador único do contador.',
    example: 'site_access',
    required: false, // Estes campos podem não estar presentes em todas as respostas
  })
  identifier?: string;

  @ApiProperty({
    description: 'O ID do documento do contador no banco de dados.',
    example: '605c6c2e8c8a1b001f3e8b8c',
    required: false,
  })
  _id?: string;
}