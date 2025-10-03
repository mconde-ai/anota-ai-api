import { ApiPropertyOptional } from '@nestjs/swagger'; // Usamos ApiPropertyOptional
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'O novo endereço de e-mail do usuário.',
    example: 'novo.email@exemplo.com',
  })
  @IsOptional() // Validador que torna o campo opcional
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'A nova senha do usuário, com no mínimo 8 caracteres.',
    example: 'novaSenhaSuperForte456',
    minLength: 8,
  })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password?: string;
}