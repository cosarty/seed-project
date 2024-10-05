import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getHello() {
    const user = await this.prisma.user.findFirst({ include: { Post: true } });
    return user;
  }

  @Get('/add')
  addUser() {
    return this.prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
        Post: {
          create: { title: 'Hello World', updatedAt: new Date() },
        },
        profile: {
          create: { bio: 'I like turtles' },
        },
      },
    });
  }

  @Get('/update')
  updateUser() {
    return this.prisma.user.update({
      where: {
        id: 3,
      },
      data: {
        Post: {
          connect: {
            id: 2,
          },
        },
      },
    });
  }
}
