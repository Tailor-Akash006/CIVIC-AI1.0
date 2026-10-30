import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRoleDto {
  CITIZEN = 'CITIZEN',
  ADMIN = 'ADMIN',
  AUTHORITY = 'AUTHORITY',
}

export class RegisterDto {
  @ApiProperty({ example: 'Sarah Jenkins', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sarah.jenkins@example.org', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRoleDto, default: UserRoleDto.CITIZEN, required: false })
  @IsOptional()
  @IsEnum(UserRoleDto)
  role?: UserRoleDto;

  @ApiProperty({ example: '+1 (555) 234-8901', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Public Works Rapid Asphalt Squad', required: false })
  @IsOptional()
  @IsString()
  department?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'citizen@civicmind.demo', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'CivicMind2026!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
