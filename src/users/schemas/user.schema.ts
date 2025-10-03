import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ 
  // Adiciona automaticamente os campos `createdAt` e `updatedAt`.
  timestamps: true,
 })
export class User extends Document {
  @Prop({
    required: true,
    unique: true, // Garante que não haverá dois usuários com o mesmo e-mail.
    trim: true, // Remove espaços em branco do início e do fim.
    lowercase: true // Converte o e-mail para minúsculas antes de salvar.
    })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Sobrescreve o método `toJSON` do Mongoose.
 * Este método é chamado sempre que um documento é convertido para JSON (ex: ao ser enviado em uma resposta da API).
 * Usamos para remover o campo de senha do objeto retornado, garantindo que o hash nunca seja exposto.
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Middleware (hook) do Mongoose que é executado ANTES do evento 'save'.
 * Usado para criptografar a senha do usuário automaticamente antes de persistir no banco de dados.
 */
UserSchema.pre<User>('save', async function (next) {
  // Executa a criptografia apenas se a senha foi modificada (ou é um novo usuário).
  if (!this.isModified('password')) {
    return next();
  }
  // 'Salt' é um valor aleatório adicionado à senha antes do hash para aumentar a segurança.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});