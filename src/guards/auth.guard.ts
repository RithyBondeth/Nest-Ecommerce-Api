import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthJwtPayload } from "src/auth/types/auth-jwtPayload";
import { User } from "src/entities /user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, 
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(User) private userRepo: Repository<User>
    ) {}

    async canActivate(ctx: ExecutionContext) {
        //Get Role from Metadata via "roles" key
        const roles = this.reflector.getAllAndOverride("roles", [
            ctx.getHandler(),
            ctx.getClass()
        ])

        if(roles?.length) {
            const request = ctx.switchToHttp().getRequest()
            const token = request.headers?.authorization?.split("Bearer ")[1]
            
            if(!token) throw new UnauthorizedException(`Authorization token not found (Only ${roles} role can access)`)

            try {
                //Verify JWT Token
                const payload: AuthJwtPayload = await this.jwtService.verifyAsync(token, {
                    secret: this.configService.get<string>("JWT_SECRET") 
                })
                
                //Find user by ID from payload
                const user = await this.userRepo.findOne({ where: { id: payload.sub } })

                //If the user is not found
                if(!user) throw new UnauthorizedException("User not found")

                //Check if user role matches any of the roles from metadata
                if(roles.includes(user.role)) return true

                //If user role doesn't match, then return false
                throw new ForbiddenException("Insufficient permissions")
            } catch(error) {  
                console.log(error)
                throw new UnauthorizedException("Invalid Token or Insufficient permissions")
            }   
        }
    }

}