import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
    @IsNumber()
    @IsNotEmpty()
    APP_PORT: number;

    @IsString() 
    @IsNotEmpty()
    DB_NAME: string;

    @IsNumber()
    @IsNotEmpty()
    DB_PORT: number;

    @IsString()
    DB_HOST: string;

    @IsString()
    DB_TYPE: string;
    
    @IsString()
    @IsNotEmpty()
    DB_USERNAME: string;

    @IsString()
    @IsNotEmpty()
    DB_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    JWT_SECRET_KEY: string;

    @IsString()
    @IsNotEmpty()
    JWT_TOKEN_EXPIRE_TIME: string;

    @IsNumber()
    @IsNotEmpty()
    HASH_SALT_ROUNDS: number
}
 
export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        {enableImplicitConversion: true}
    );
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    } 
    
    return validatedConfig;
}