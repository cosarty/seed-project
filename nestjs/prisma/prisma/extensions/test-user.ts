import { Prisma } from '@prisma/client';

export const TestUserExtend = () =>
  Prisma.defineExtension({
    result: {
      user: {
        email2: {
          needs: { email: true },
          compute(user) {
            return user.email + '3232';
          },
        },
      },
    },
  });
