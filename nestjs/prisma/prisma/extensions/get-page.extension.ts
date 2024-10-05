import { Prisma } from '@prisma/client';

import type { PrismaClient } from '@prisma/client';

type GetPageRes<T> = {
  records: T;
  total: number;
  page: number;
  size: number;
};

/**
 * 查询并返回列表+总数
 * @param prisma - PrismaClient实例
 * @returns 返回一个包含getPage方法的对象
 */
export function createGetPageExtension<TModel = any, TArgs = any>(
  prisma: PrismaClient,
) {
  return {
    name: 'getPage',
    model: {
      $allModels: {
        async getPage(
          this: TModel,
          args?: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findMany'>>,
          limit?: { page?: number; size?: number },
        ): Promise<GetPageRes<Prisma.Result<TModel, TArgs, 'findMany'>>> {
          const context = Prisma.getExtensionContext(this);
          const { page = 1, size = 10 } = limit ?? {};
          const [records, total] = await prisma.$transaction([
            (context as any).findMany({
              orderBy: { id: 'desc' },
              skip: (page - 1) * size,
              take: parseInt(size as unknown as string),
              ...((args ?? {}) as any),
            }),
            (context as any).count({ where: (args as any)?.where }),
          ]);

          return {
            records,
            total,
            page: page * 1,
            size: size * 1,
          };
        },
      },
    },
  };
}

export type GetPage<TModel, TArgs> = ReturnType<
  typeof createGetPageExtension<TModel, TArgs>
>['model']['$allModels']['getPage'];
