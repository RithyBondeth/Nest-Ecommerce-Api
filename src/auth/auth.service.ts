import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities /user.entity';
import { Repository } from 'typeorm';
import { AuthRegisterDTO } from './dtos/auth-register.dto';
import { UpdateUserRoleDTO } from './dtos/auth-updateUserRole.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { AuthLoginDTO } from './dtos/auth-login.dto';
import { UserInfo } from 'src/user/decorators/user.decorator';
import { UserResponseDTO } from 'src/user/dtos/user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService
    ){}    

    async register(body: AuthRegisterDTO) {
        //Find if user already exists
        const existingUser = await this.userRepo.findOne({ 
            where: { email: body.email }
        })

        if(existingUser) throw new ConflictException("Username or Email already exists")

        //Insert user in database
        const user = this.userRepo.create(body)
        await this.userRepo.save(user)

        //Generate Token
        const payload: AuthJwtPayload = {
            username: user.username,
            sub: user.id,
            role: user.role
        }

        return { access_token: this.jwtService.sign(payload) }
    }

    async login(body: AuthLoginDTO) {
        //Find if user with that email is exists
        const existingUser = await this.userRepo.findOne({ where: { email: body.email } })

        if(!existingUser) throw new NotFoundException("Invalid Credential")

        //Compare Password
        const isValidPassword = await bcrypt.compare(body.password, existingUser.password) 

        if(!isValidPassword) throw new NotFoundException("Invalid Credential")

        const payload: AuthJwtPayload = {
            username: existingUser.username,
            sub: existingUser.id,
            role: existingUser.role
        }

        return { access_token: this.jwtService.sign(payload) }
    }

    async setUserRole(body: UpdateUserRoleDTO, userId: number) {
        //Find if user already exists
        const existingUser = await this.userRepo.findOne({ where: { id: userId } })

        if(!existingUser) throw new NotFoundException(`User with id ${userId} not found`)

        existingUser.role = body.role
       
        return this.userRepo.save(existingUser)
    }

    async currentUser(user: UserInfo): Promise<UserResponseDTO> { 
        const existingUser = await this.userRepo.findOne({ where: { username: user.username } })

        if(!existingUser) throw new NotFoundException("Invalid Credential")

        return new UserResponseDTO(existingUser)
    }   
}
