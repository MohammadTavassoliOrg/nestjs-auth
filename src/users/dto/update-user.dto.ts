import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsBoolean()
    isDeleted: boolean;

    @IsOptional()
    @IsString()
    refresh_token: string;

    @IsOptional()
    @IsString()
    access_token_hash: string;

    @IsOptional()
    @IsDate()
    refresh_token_generate_date: Date;
}
