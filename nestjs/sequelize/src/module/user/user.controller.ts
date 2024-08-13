import { ForgetPassword, UpdateEmailDto } from './dto/user.dto';

import { User } from '@/common/decorator/user.decorator';
import { Auth, Super } from '@/common/role/auth.decorator';
import * as svgCaptcha from 'svg-captcha';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import {  UpdatePasswordDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { ModelsEnum, PickModelType } from '@/models';
import { UserType } from '@/models/users';
import { MyException } from '@/util/MyException';
import { Op } from 'sequelize';
// 更新用户

@Controller('user')
export class UserController {
  constructor(
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
    @Inject(ModelsEnum.AuthCode)
    private readonly authCode: PickModelType<ModelsEnum.AuthCode>,
  ) {}
  @Get('getCurrent')
  @Auth()
  getCurrent(@User() user) {
    return user;
  }

  @Post('updatePassword')
  @Auth()
  async updatePassword(
    @Body() payload: UpdatePasswordDto,
    @User() user,
    @Session() session,
  ) {
    console.log(session.code);

    if (session.code !== payload.capacha) {
      throw new MyException({ code: '400', error: '验证码错误' });
    }
    const hash = await argon2.hash(payload.newPassword, {
      type: argon2.argon2d,
    });
    await this.user.update(
      { password: hash },
      { where: { email: user.email } },
    );
    return { message: '密码更新，成功请重新登录' };
  }

  // 更新用户
  @Post('update')
  @Auth()
  async updateUser(@Body() payload: UserType, @User() user) {
    await this.user.update(
      { sex: payload.sex },
      { where: { userId: user.userId } },
    );
    return { message: '更新成功' };
  }

  // 编辑用户
  @Post('updateUser')
  @Auth(['admin', 'super'])
  async updateOtheUser(@Body() { userId, ...res }: UserType) {
    await this.user.update({ ...res }, { where: { userId } });
    return { message: '更新成功' };
  }

  @Post('bind')
  @Auth(['super', 'admin'])
  async bindUser(@User() user: UserType, @Body() payload: any) {
    // 封号 要清空班级 删除课程
    await this.user.update(
      { isBan: payload.isBan },
      { where: { userId: payload.userId } },
    );
    return { message: payload.isBan ? '封号成功' : '解封成功' };
  }

  @Post('delete')
  @Auth(['super'])
  async deleteUser(@User() user: UserType, @Body() payload: any) {
    // 封号 要清空班级 删除课程
    await this.user.destroy({ where: { userId: payload.userId } });
    return { message: '删除成功' };
  }

  // 更改邮箱
  @Post('updateEmail')
  @Auth()
  async updateEmail(@Body() payload: UpdateEmailDto, @User() user) {
    await this.user.update(
      { email: payload.email },
      { where: { userId: user.userId } },
    );
    await this.authCode.update(
      { work: false },
      { where: { email: payload.email } },
    );
    await this.authCode.update(
      { work: true },
      { where: { email: user.email } },
    );
    return null;
  }
  @Get('code')
  userCode(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    req.session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  // 获取老师列表
  @Get('getTeacher')
  @Auth()
  async getTeacher(@Query() pram: any) {
    return await this.user.scope('hidePassword').findAndCountAll({
      order: [['createdAt', 'DESC']],
      where: {
        auth: 'teacher',
        ...(pram.flag === 'all' ? {} : { classId: null }),
        ...(pram.account ? { account: { [Op.substring]: pram.account } } : {}),
        ...(pram.userName
          ? { userName: { [Op.substring]: pram.userName } }
          : {}),
        ...(pram.flag === 'all' ? {} : { isAdmin: false }),
      },

      include: {
        association: 'department',
      },
      ...(pram.pageSize ? { limit: Number(pram.pageSize) ?? 0 } : {}),
      ...(pram.pageCount
        ? { offset: Number((pram.pageCount - 1) * pram.pageSize) ?? 0 }
        : {}),
    });
  }

  // 获取学生列表
  @Get('getstudent')
  @Auth()
  async getStudent(@Query() pram: any) {
    return await this.user.scope('hidePassword').findAndCountAll({
      order: [['createdAt', 'DESC']],
      where: {
        auth: 'student',
        ...(pram.flag === 'all' ? {} : { classId: null }),
        ...(pram.account ? { account: { [Op.substring]: pram.account } } : {}),
        ...(pram.userName
          ? { userName: { [Op.substring]: pram.userName } }
          : {}),
      },
      include: {
        association: 'class',
        include: [
          {
            association: 'department',
          },
        ],
      },
      limit: Number(pram.pageSize),
      offset: Number((pram.pageCount - 1) * pram.pageSize),
    });
  }

  @Post('setAdmin')
  @Auth(['super'])
  async setAdmin(@User() user: UserType, @Body() payload: any) {
    // 封号 要清空班级 删除课程
    await this.user.update(
      { isAdmin: payload.isAdmin },
      { where: { userId: payload.userId } },
    );
    return { message: payload.isAdmin ? '设置成功' : '取消成功' };
  }

  @Post('updateForgetPassword')
  async updateForgetPassword(@Body() payload: ForgetPassword) {
    const hash = await argon2.hash(payload.password, {
      type: argon2.argon2d,
    });
    await this.user.update(
      { password: hash },
      { where: { email: payload.email } },
    );
    return { message: '密码重置成功' };
  }
}
