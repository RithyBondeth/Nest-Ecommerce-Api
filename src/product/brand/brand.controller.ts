import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandResponseDTO } from './dtos/brand-response.dto';
import { CreateBrandDTO } from './dtos/brand-create.dto';
import { UpdateBrandDTO } from './dtos/brand-update.dto';
import { Roles } from 'src/decorators/roles.docorator';
import { UserRoles } from 'src/entities /user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { BrandCountDTO } from './dtos/brand-count.dto';

@Controller("product/brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  findAll(): Promise<BrandResponseDTO[]> {
    return this.brandService.findAll()
  }

  @Get("count")
  count(): Promise<BrandCountDTO> {
    return this.brandService.count()
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) brandId: number): Promise<BrandResponseDTO> {
    return this.brandService.findOne(brandId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body: CreateBrandDTO): Promise<BrandResponseDTO> {
    return this.brandService.create(body)    
  }
 
  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  update(@Body() body: UpdateBrandDTO, @Param("id", ParseIntPipe) brandId: number) {
    return this.brandService.update(body, brandId)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) brandId: number) {
    return this.brandService.delete(brandId)
  }
}
