import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessCounter } from './schemas/access-counter.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AccessCounter.name)
    private accessCounterModel: Model<AccessCounter>,
  ) {}

  /**
   * Incrementa o contador de acessos ao site.
   * Utiliza a operação atômica `$inc` do MongoDB para garantir a consistência dos dados
   * mesmo sob alta concorrência (evitando "race conditions").
   * @returns O documento do contador atualizado.
   */
  async increment() {
    // Encontra o documento pelo identificador, incrementa o campo 'count' em 1.
    // Se o documento não existir (upsert: true), ele será criado.
    // new: true garante que o método retorne o documento atualizado.
    const updatedCounter = await this.accessCounterModel.findOneAndUpdate(
      { identifier: 'site_access' },
      { $inc: { count: 1 } }, // Operação atômica de incremento.
      { upsert: true, // Cria o documento se ele não existir na primeira execução.
        new: true // Retorna o documento após a atualização.
      },
    );
    return updatedCounter;
  }

  /**
   * Retorna o valor atual do contador de acessos.
   */
  async getCount() {
    const counter = await this.accessCounterModel.findOne({
      identifier: 'site_access',
    });
    // Se o contador ainda não existir no banco (nenhum incremento foi feito),
    // retorna um objeto padrão com contagem 0.
    return counter ? counter : { count: 0 };
  }
}