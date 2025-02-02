import { UserRoles } from "src/entities /user.entity"

export interface AuthJwtPayload {
    username: string,
    sub: number,
    role: UserRoles
    iat?: number,
    exp?: number
}