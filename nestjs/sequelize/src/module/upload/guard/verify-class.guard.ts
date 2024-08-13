import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { MyException } from '@/util/MyException';
import { UserType } from '@/models/users';
@Injectable()
export class VerifyClassGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = (request.user as any).user as UserType; 
      return true;
    // if (!!classInfo) throw new MyException({ error: '暂无权限', code: '400' });
    // throw new MyException({ error: '班級不存在', code: '400' });
  }
}
