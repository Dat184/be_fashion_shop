import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

// use omit to remove password and email field from CreateUserDto
export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password' as const,
  'email' as const,
]) {
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;
}
