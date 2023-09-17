import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { validate } from './helpers/env.validation';
import configuration from 'config/configuration';
import databaseConfig from 'config/database.config';

@Module({
  imports: [ConfigModule.forRoot({
    validate,
    isGlobal: true,
    load: [configuration, databaseConfig]
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
