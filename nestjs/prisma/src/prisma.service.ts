import { Injectable } from '@nestjs/common';
import { ExtendedPrismaClient } from 'prisma/extensions/extended-client';

@Injectable()
export class PrismaService extends ExtendedPrismaClient {
  async onModuleInit() {
    await this.$connect();
  }
}
