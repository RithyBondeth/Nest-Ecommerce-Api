import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDTO } from './dtos/user-response.dto';
import { CountQueryParamDTO, UserCountDTO } from './dtos/user-count.dto';
import { UserFilterDTO } from './dtos/user-filter.dto';
import { Roles } from 'src/decorators/roles.docorator';
import { UserRoles } from 'src/entities /user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(
    @Query() filter: UserFilterDTO
  ): Promise<UserResponseDTO[]> {
    return this.userService.findAll(filter)
  }
 
  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get("count")
  count(@Query() count: CountQueryParamDTO): Promise<UserCountDTO> {
    const filter = { userRole: count.role }
    return this.userService.count(filter)
  } 

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get("id/:id")
  findOneById(@Param("id", ParseIntPipe) userId: number): Promise<UserResponseDTO> {
    return this.userService.findOneById(userId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get("email/:email")
  findOneByEmail(@Param("email") email: string): Promise<UserResponseDTO> {
    return this.userService.findOneByEmail(email)
  }
}