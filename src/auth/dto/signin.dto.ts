import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}