import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
    @IsNumber()
    @IsNotEmpty()
    PORT: number;

    @IsString() 
    @IsNotEmpty()
    DB_NAME: string;

    @IsNumber()
    @IsNotEmpty()
    DB_PORT: number = 3306;

    @IsString()
    DB_HOST: string = 'localhost';

    @IsString()
    DB_TYPE: string = 'mysql';
    
    @IsString()
    @IsNotEmpty()
    DB_USERNAME: string;

    @IsString()
    @IsNotEmpty()
    DB_PASSWORD: string;
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