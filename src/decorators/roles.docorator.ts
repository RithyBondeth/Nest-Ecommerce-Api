import { SetMetadata } from "@nestjs/common"
import { UserRoles } from "src/entities /user.entity"

export const Roles = (...roles: UserRoles[]) => {
    return SetMetadata("roles", roles)
}