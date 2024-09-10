import { VrifyIdentity } from '@/common/rule/verify-identity.rule';
import { IsDefined, Validate, IsUUID } from 'class-validator';

export class UploadClassAvatar {
  @IsDefined({ message: '请输入班级编号' })
  classId: string;
}
