import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CreateOrderDto } from './dtos/order-create.dto';
import { GetOrderDto } from './dtos/order-get.dto';
import { Roles } from 'src/decorators/roles.docorator';
import { UserRoles } from 'src/entities /user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrderStatusDto } from './dtos/order-status.dto';
import { OrderFilterDto } from './dtos/order-filter.dto';

@Controller("product/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get("all")
  getAllOrder(@Query() filter: OrderFilterDto ): Promise<GetOrderDto[]> {
    return this.orderService.getAllOrder(filter)
  }

  @Get()
  getOrder(@User() user: UserInfo): Promise<GetOrderDto> {
    return this.orderService.getOrder(user)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get(":id")
  getOrderById(@Param("id", ParseIntPipe) orderId: number): Promise<GetOrderDto> {
    return this.orderService.getOrderById(orderId)
  }

  @Post("create-order")
  createOrderFromCart(@User() user: UserInfo): Promise<CreateOrderDto> {
    return this.orderService.createOrderFromCart(user)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Put("update-order/:id")
  updateOrderStatus(
    @Param("id", ParseIntPipe) orderId: number, 
    @Body() body: OrderStatusDto
  ) {
    return this.orderService.updateOrderStatus(orderId, body)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete("delete-order/:id")
  deleteCancelledOrder(@Param("id", ParseIntPipe) orderId: number) {
    return this.orderService.deleteCancelledOrder(orderId)
  }
}
