import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
    @IsNumber()
    PORT: number;

    @IsString() 
    DB_NAME: string;

    @IsNumber()
    DB_PORT: number = 3306;
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
    console.log(validatedConfig);
    
    return validatedConfig;
}