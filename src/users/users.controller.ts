import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Me } from '../common/decorators/me.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from './entities/user.entity';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findAll(@Me() me): Promise<User> {
    const selection = {
      id: true,
      firstName: true,
      lastName: true,
      isDeleted: true,
      email: true,
    }
    return await this.usersService.findUserById(me.id, selection);
  }

  @Delete()
  remove(@Me() me): Promise<{}> {
    return this.usersService.removeUserById(me.id);
  }
}
