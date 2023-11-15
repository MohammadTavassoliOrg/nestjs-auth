import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth-signup.dto';
import { UsersService } from 'src/users/users.service';
import { AuthErrors } from './enums';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/auth-signin.dto';
import { HashManager } from '../common/helpers/hash-manager.helper';
import { LogInInterface } from './interface/auth-login.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly usersService: UsersService, 
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: SignInDto): Promise<LogInInterface> {
    const userFound = await this.usersService.findUserByEmail(signInDto.email);
    if (!userFound)
      throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);

    if (!new HashManager(this.configService).compareSync(signInDto.password, userFound.password)) {
      throw new BadRequestException(AuthErrors.INVALID_EMAIL_OR_PASSWORD);
    }

    const { refresh_token, refresh_token_generate_date } = this.authService.generateRefreshToken();
    const access_token = await this.authService.generateAccessToken(userFound.id);
    const access_token_hash = await bcrypt.hashSync(access_token, +this.configService.get('app.salt'));

    const newTokens = {
      refresh_token, refresh_token_generate_date, access_token_hash
    }
    await this.usersService.updateUserTokens(userFound.id, newTokens);

    return {
      access_token,
      refresh_token,
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<LogInInterface> {
    const userFound = await this.usersService.isExistsUser(signUpDto.email);
    if (userFound)
      throw new UnauthorizedException(AuthErrors.DUPLICATE_EMAIL);
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
