import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
    secret: process.env.JWT_SECRET_KEY,
    expires: process.env.JWT_TOKEN_EXPIRE_TIME
}));
