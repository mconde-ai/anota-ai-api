import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Cria um novo usuário no banco de dados.
   * O hashing da senha é tratado automaticamente pelo hook no schema.
   * @param createUserDto Os dados para a criação do usuário.
   * @returns O usuário criado.
   * @throws {ConflictException} Se o e-mail já estiver em uso.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    try {
      return await createdUser.save();
    } catch (error) {
      // O código 11000 do MongoDB indica uma violação de índice único (neste caso, o e-mail).
      if (error.code === 11000) {
        throw new ConflictException('Email already exists.');
      }
      // Re-lança outros erros inesperados para serem tratados pelo filtro global.
      throw error;
    }
  }

  /**
   * Encontra e retorna um usuário pelo seu ID.
   * @param id O ID do usuário a ser encontrado.
   * @returns O usuário encontrado, sem o campo de senha.
   * @throws {NotFoundException} Se o usuário com o ID fornecido não for encontrado.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id)
      // O método .select('-password') instrui o Mongoose a excluir o campo de senha do resultado.
      // Esta é uma camada de segurança adicional, embora o método toJSON no schema já faça isso.
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}