import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({
    description: 'O ID único do usuário no banco de dados.',
    example: '605c6c2e8c8a1b001f3e8b8c',
  })
  _id: string;

  @ApiProperty({
    description: 'O endereço de e-mail único do usuário.',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'A data de criação do registro do usuário.',
    example: '2025-10-03T14:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'A data da última atualização do registro do usuário.',
    example: '2025-10-03T14:00:00.000Z',
  })
  updatedAt: Date;
}