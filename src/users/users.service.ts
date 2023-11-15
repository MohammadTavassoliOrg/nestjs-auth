import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserTokensDto } from './dto/update-user-tokens.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService
  ) {}

  async createUser(
    createUserDto: CreateUserDto, refresh_token: string, 
    refresh_token_generate_date: Date
  ) {

    const password = await this.hashUserPassword(createUserDto.password);
    const user = await this.usersRepository.save({
      ...createUserDto, password,
      refresh_token, refresh_token_generate_date
    });
    return user;
  }

  async hashUserPassword(password: string): Promise<string> {
    const hash = await bcrypt.hashSync(
      password, +this.configService.get('app.salt')
    );
    return hash;
  }

  async addUserTokenHash(id: number, access_token_hash: string) {
    const user = await this.usersRepository.update(id, { access_token_hash });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({where: 
      { email, isDeleted: false }
    });
    return user;
  }

  async isExistsUser(email: string): Promise<true | false> {
    const user = await this.usersRepository.findOne({where: 
      { email, isDeleted: false }
    });
    return user ? true : false;
  }

  async findOneByRefreshToken(refresh_token: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({where: 
      { refresh_token, isDeleted: false }
    });
    return user;
  }

  async updateUserTokens(id: number, updateUserDto: UpdateUserTokensDto) {
    const user = await this.usersRepository.save({...updateUserDto, id});
    return user;
  }
}
