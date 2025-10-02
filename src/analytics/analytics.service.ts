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

  async increment() {
    // Encontra o documento pelo identificador, incrementa o campo 'count' em 1.
    // Se o documento não existir (upsert: true), ele será criado.
    // new: true garante que o método retorne o documento atualizado.
    const updatedCounter = await this.accessCounterModel.findOneAndUpdate(
      { identifier: 'site_access' },
      { $inc: { count: 1 } },
      { upsert: true, new: true },
    );
    return updatedCounter;
  }

  async getCount() {
    const counter = await this.accessCounterModel.findOne({
      identifier: 'site_access',
    });
    // Se o contador nunca foi incrementado, pode não existir. Retornamos 0 nesse caso.
    return counter ? counter : { count: 0 };
  }
}