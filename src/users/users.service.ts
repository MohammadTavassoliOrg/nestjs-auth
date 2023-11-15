import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

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
    const hash = await bcrypt.hashSync(password, +this.configService.get('app.salt'));
    return hash;
  }

  async addUserTokenHash(id: number, access_token_hash: string) {
    const user = await this.usersRepository.update(id, { access_token_hash });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({where: { email, isDeleted: false }});
    return user;
  }

  async findOneByRefreshToken(refresh_token: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({where: { refresh_token, isDeleted: false }});
    return user;
  }

  async updateUserTokens(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.save({...updateUserDto, id});
    return user;
  }
}
