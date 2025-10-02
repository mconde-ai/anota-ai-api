import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose'; // 1. Importe
import { User, UserSchema } from './schemas/user.schema'; // 2. Importe

@Module({
  imports: [ // 3. Adicione o imports array
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}