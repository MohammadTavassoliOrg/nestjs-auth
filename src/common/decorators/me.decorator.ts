import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Me = createParamDecorator((data: any, context: ExecutionContext): {id: number} => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
