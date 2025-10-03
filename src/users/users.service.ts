import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Cria um novo usuário no banco de dados.
   * @param createUserDto Os dados para a criação do usuário.
   * @returns O usuário criado.
   * @throws {ConflictException} Se o e-mail já estiver em uso.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    try {
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists.');
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todos os usuários.
   * O campo de senha é excluído de todos os resultados.
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  /**
   * Encontra e retorna um usuário pelo seu ID.
   * @param id O ID do usuário a ser encontrado.
   * @returns O usuário encontrado, sem o campo de senha.
   * @throws {NotFoundException} Se o usuário com o ID fornecido não for encontrado.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  /**
   * Atualiza os dados de um usuário.
   * @param id O ID do usuário a ser atualizado.
   * @param updateUserDto Os dados a serem atualizados.
   * @returns O usuário com os dados atualizados.
   * @throws {NotFoundException} Se o usuário não for encontrado.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // O Mongoose 'pre-save' hook que faz o hash da senha só é ativado com .save()
    // Portanto, se a senha for atualizada, precisamos buscá-la, modificá-la e salvá-la.
    if (updateUserDto.password) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        user.password = updateUserDto.password;
        // O restante dos campos são atualizados separadamente para garantir a execução do hook
        if (updateUserDto.email) user.email = updateUserDto.email;
        return user.save();
    }
    
    // Se a senha não for alterada, podemos usar um método mais direto.
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  /**
   * Remove um usuário do banco de dados.
   * @param id O ID do usuário a ser removido.
   * @returns O usuário que foi removido.
   * @throws {NotFoundException} Se o usuário não for encontrado.
   */
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return deletedUser;
  }
}