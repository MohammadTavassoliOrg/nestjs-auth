import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashManager {
    constructor(private configService: ConfigService) {}

    compareSync(string: string, hash: string) {
        const result = bcrypt.compareSync(string, hash);
        console.log('>>>>>: ',result);
        
        return result;
    }

    hashSync(string: string): string {
        const result = bcrypt.hashSync(string, this.configService.get('app.salt'));
        return result;
    }
}