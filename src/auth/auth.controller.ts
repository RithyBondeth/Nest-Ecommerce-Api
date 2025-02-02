import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dtos/auth-register.dto';
import { UpdateUserRoleDTO } from './dtos/auth-updateUserRole.dto';
import { AuthLoginDTO } from './dtos/auth-login.dto';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { UserResponseDTO } from 'src/user/dtos/user-response.dto';
import { Roles } from 'src/decorators/roles.docorator';
import { UserRoles } from 'src/entities /user.entity';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body)
  }

  @Post("login")
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Patch("role/:id")
  setUserRole(
    @Param("id", ParseIntPipe) userId: number,
    @Body() body: UpdateUserRoleDTO
  ) {
    return this.authService.setUserRole(body, userId)
  }
  
  @Get("me")
  currentUser(@User() user: UserInfo): Promise<UserResponseDTO> {
    return this.authService.currentUser(user)
  }
}
