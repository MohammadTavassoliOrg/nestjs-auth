import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    salt: process.env.HASH_SALT_ROUNDS
}));