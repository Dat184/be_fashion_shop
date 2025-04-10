import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Name is not valid' })
  name: string;

  @IsString({ message: 'Password is not valid' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'Phone is not valid' })
  phone: string;

  @IsString({ message: 'Address is not valid' })
  address: string;

  @IsString({ message: 'gender is not valid' })
  gender: string;
}
