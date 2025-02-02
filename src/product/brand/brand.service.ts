import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/entities / brand.entity';
import { Repository } from 'typeorm';
import { BrandResponseDTO } from './dtos/brand-response.dto';
import { CreateBrandDTO } from './dtos/brand-create.dto';
import { UpdateBrandDTO } from './dtos/brand-update.dto';
import { Product } from 'src/entities /product.entity';
import { BrandCountDTO } from './dtos/brand-count.dto';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand) private brandRepo: Repository<Brand>,
        @InjectRepository(Product) private productRepo: Repository<Product>
    ){}

    async findAll(): Promise<BrandResponseDTO[]> {
        const brands = await this.brandRepo.find()
        if(!brands) throw new NotFoundException("There's no brands in database")

        return brands.map((brand) => new BrandResponseDTO(brand))
    }   

    async findOne(brandId: number): Promise<BrandResponseDTO> {
        const brand = await this.brandRepo.findOne({ where: { id: brandId } })
        if(!brand) throw new NotFoundException(`Band with ${brandId} id not found`)

        return new BrandResponseDTO(brand)
    }

    async create(body: CreateBrandDTO): Promise<BrandResponseDTO> {
        const existingBrand = await this.brandRepo.findOne({ where: { name: body.name } })
        if(existingBrand) throw new ConflictException(`Brand ${body.name} already exists`)

        const brand = this.brandRepo.create(body)
        await this.brandRepo.save(brand)

        return new BrandResponseDTO(brand)
    }

    async update(body: UpdateBrandDTO, brandId: number): Promise<BrandResponseDTO> {
        const updatedBrand = await this.findOne(brandId)

        updatedBrand.name = body.name
        const brand = await this.brandRepo.save(updatedBrand)

        return new BrandResponseDTO(brand)
    }

    async delete(brandId: number) {
        const existingBrand = await this.brandRepo.findOne({
            relations: ["products"],
            where: { id: brandId }
        })

        if(!existingBrand) throw new NotFoundException(`Brand with ${brandId} id not found`)

        if(existingBrand.products?.length) {
            await this.productRepo.delete({ brand: { id: brandId }})
        }

        await this.brandRepo.delete({ id: brandId })

        return "Brand Deleted Successfully"
    }

    async count(): Promise<BrandCountDTO> {
        const count = await this.brandRepo.count()
       return new BrandCountDTO(count)
    }
}
