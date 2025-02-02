import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CreateCartDto } from './dtos/cart-create.dto';
import { GetCartDTO } from './dtos/cart-get.dto';
import { AddItemToCartDto } from './dtos/cart-additem.dto';
import { GetAllCartDTO } from './dtos/cart-getall.dto';
import { Roles } from 'src/decorators/roles.docorator';
import { UserRoles } from 'src/entities /user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateCartItemDto } from './dtos/cart-updateitem.dto';

@Controller("product/cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Get("all")
  getAllCart(): Promise<GetAllCartDTO[]> {
    return this.cartService.getAllCart()
  }

  @Get()
  getCart(@User() user: UserInfo): Promise<GetCartDTO> {
    const userId = user.sub
    return this.cartService.getCart(userId)
  }

  @Post("create") 
  createCart(@User() user: UserInfo): Promise<CreateCartDto> {
    return this.cartService.createCart(user)
  }

  @Post("add-item")
  addItemToCart(@User() user: UserInfo, @Body() body: AddItemToCartDto): Promise<GetCartDTO> {
    return this.cartService.addItemToCart(user, body)
  }

  @Put("update-item/:id")
  updateCartItem(
    @User() user: UserInfo, 
    @Param("id", ParseIntPipe) cartItemId: number,
    @Body() body: UpdateCartItemDto  
  ) {
    return this.cartService.updateCartItem(user, cartItemId, body)
  }

  @Delete("delete-item/:id")
  removeItemFromCart(@User() user: UserInfo, @Param("id", ParseIntPipe) cartItemId: number) {
    return this.cartService.removeItemFromCart(user, cartItemId)
  }
}
