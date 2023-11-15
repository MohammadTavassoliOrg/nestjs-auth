import { PickType } from "@nestjs/mapped-types";
import { UpdateUserDto } from "./update-user.dto";

export class UpdateUserTokensDto extends PickType(UpdateUserDto, [
    'access_token_hash', 'refresh_token', 'refresh_token_generate_date'
] as const) {}