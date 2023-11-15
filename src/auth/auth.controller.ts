import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { AuthErrors } from './enums';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly usersService: UsersService, 
    private readonly configService: ConfigService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const userFound = await this.usersService.findUserByEmail(signUpDto.email);
    if (userFound)
      throw new UnauthorizedException(AuthErrors.INVALID_CREDINTIALS);

    const { refresh_token, refresh_token_generate_date } = this.authService.generateRefreshToken();

    // Storing user in database to get id
    const storedUser = await this.usersService.createUser(
      signUpDto, refresh_token, refresh_token_generate_date
    );

    const access_token = await this.authService.generateAccessToken(storedUser.id);
    const access_token_hash = await bcrypt.hashSync(access_token, +this.configService.get('app.salt'));

    await this.usersService.addUserTokenHash(storedUser.id, access_token_hash);

    return {
      access_token,
      refresh_token,
    }
  }
}
