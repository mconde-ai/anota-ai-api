import { ApiProperty } from '@nestjs/swagger'; // 1. Importar
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'O endereço de e-mail único do usuário.',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string;

  @ApiProperty({
    description: 'A senha do usuário, com no mínimo 8 caracteres.',
    example: 'senhaForte123',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}