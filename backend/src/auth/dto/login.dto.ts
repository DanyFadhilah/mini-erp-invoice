import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@mail.com',
    description: 'email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'admin123',
    description: 'password',
  })
  @IsString()
  password!: string;
}
