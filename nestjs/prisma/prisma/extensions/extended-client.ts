import { PrismaClient } from '@prisma/client';

import { createGetPageExtension, type GetPage } from './get-page.extension';
import { createResultTimestampExtension } from './result-timestamp.extension';
import { TestUserExtend } from './test-user';

type ModelsWithExtensions = {
  [Model in keyof PrismaClient]: PrismaClient[Model] extends {
    findMany: (args: infer TArgs) => Promise<any>;
  }
    ? {
        getPage: GetPage<PrismaClient[Model], TArgs>;
      } & PrismaClient[Model]
    : PrismaClient[Model];
};

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: ConstructorParameters<typeof PrismaClient>[0]) {
    super(options);
    return this.$extends(createGetPageExtension(this))
      .$extends(createResultTimestampExtension())
      .$extends(TestUserExtend()) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => PrismaClient & ModelsWithExtensions;

export { ExtendedPrismaClient };
