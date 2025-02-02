import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResponseDTO } from './dtos/product-response.dto';
import { ProductFilterDTO } from './dtos/product-filter.dto';
import { CreateProductDTO } from './dtos/product-create.dto';
import { UpdateProductDTO } from './dtos/product-update.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.docorator';
import { UserRoles } from 'src/entities /user.entity';

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(
    @Query() filter: ProductFilterDTO,
  ): Promise<ProductResponseDTO[]> {
    return this.productService.findAll(filter)
  }

  @Get("/id/:id")
  findOneById(@Param("id", ParseIntPipe) productId: number): Promise<ProductResponseDTO> {
    return this.productService.findOneById(productId)
  }

  @Get("/name/:name") 
  findOneByName(@Param("name") productName: string): Promise<ProductResponseDTO> {
    return this.productService.findOneByName(productName)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body: CreateProductDTO) {
      return this.productService.create(body)
  } 

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  updateById(@Body() body: UpdateProductDTO, @Param("id", ParseIntPipe) productId: number) {
    return this.productService.update(body, productId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) productId: number) {
    return this.productService.delete(productId)
  }
}
