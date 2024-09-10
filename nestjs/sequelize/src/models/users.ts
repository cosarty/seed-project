import { UUIDV4 } from 'sequelize';
import {
  Table,
  Model,
  IsEmail,
  AllowNull,
  Column,
  PrimaryKey,
  Default,
  IsUUID,
  DefaultScope,
  HasOne,
  BelongsTo,
  Scopes,
  HasMany,
} from 'sequelize-typescript';
import uploadConf, { UploadConfType } from '@/config/upload.conf';

export type AuthType = 'student' | 'teacher' | 'admin';
export type SexType = 0 | 1;
export type UserType = {
  userId?: string;
  userName?: string;
  email?: string;
  isBan?: boolean;
  auth?: AuthType;
  sex?: SexType;
  password?: string;
  isAdmin?: boolean;
  super?: boolean;
  pic?: string;
};

@Table({ tableName: 'user' })
@DefaultScope(() => ({ attributes: { exclude: ['deletedAt'] } }))
@Scopes(() => ({
  hidePassword: { attributes: { exclude: ['password'] } },
}))
export class User extends Model<User> implements UserType {
  @PrimaryKey
  @Default(UUIDV4)
  @IsUUID('4')
  @Column
  userId: string;
  @Column
  userName: string;
  @IsEmail
  @Column
  email: string;
  @Default(false)
  @Column
  isBan: boolean;
  @Column
  auth: AuthType;
  @Column
  sex: SexType;
  @Column
  password: string;

  @Default(false)
  @Column
  isAdmin: boolean;

  @AllowNull
  @Column
  super: boolean;

  @AllowNull
  @Column
  get pic(): string {
    return this.getDataValue('pic')
      ? process.env.HOST +
          uploadConf().base['userAvatarDir'].public +
          '/' +
          this.getDataValue('pic')
      : null;
  }

  instructorId?: string;
}
