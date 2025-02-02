import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResponseDTO } from './dtos/category-response.dto';
import { CategoryCountDTO } from './dtos/category-count.dto';
import { CreateCategoryDTO } from './dtos/category-create.dto';
import { UpdateCategoryDTO } from './dtos/category-update.dto';
import { Roles } from 'src/decorators/roles.docorator';
import { UserRoles } from 'src/entities /user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller("product/category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<CategoryResponseDTO[]> {
    return this.categoryService.findAll()
  }

  @Get("count")
  count(): Promise<CategoryCountDTO> {
    return this.categoryService.count()
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) categoryId: number) {
    return this.categoryService.findOne(categoryId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body: CreateCategoryDTO) {
    return this.categoryService.create(body)
  }
  

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  updateById(
    @Body() body: UpdateCategoryDTO,
    @Param("id", ParseIntPipe) categoryId: number
  ) {
    return this.categoryService.update(body, categoryId) 
  }


  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) categoryId: number) {
    return this.categoryService.delete(categoryId)
  }
}