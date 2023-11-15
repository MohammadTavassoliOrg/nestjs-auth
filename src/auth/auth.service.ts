import { SignInDto } from './dto/auth-signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // async signIn(signInDto: SignInDto): Promise<any> {
  //   const user = await this.usersService.findUserByEmail(signInDto.email);
  //   if (user?.password !== signInDto.password) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = { id: user.id };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  async generateAccessToken(id: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      id,
    });
    return token;
  }

  generateRefreshToken() {
    const refresh_token: string = uuidv4();
    const refresh_token_generate_date: Date = new Date();
    return {
      refresh_token,
      refresh_token_generate_date,
    }
  }
}
