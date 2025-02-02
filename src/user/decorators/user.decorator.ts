import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";
import { UserRoles } from "src/entities /user.entity";

export interface UserInfo {
    username: string
    sub: number
    role: UserRoles
    iat: number
    exp: number
}

export const User = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    if(!request.user) throw new NotFoundException("There's no token")

    return request.user
})