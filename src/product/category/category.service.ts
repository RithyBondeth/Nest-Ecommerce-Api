import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities /category.entity';
import { Repository } from 'typeorm';
import { CategoryResponseDTO } from './dtos/category-response.dto';
import { CategoryCountDTO } from './dtos/category-count.dto';
import { CreateCategoryDTO } from './dtos/category-create.dto';
import { UpdateCategoryDTO } from './dtos/category-update.dto';
import { Product } from 'src/entities /product.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
        @InjectRepository(Product) private productRepo: Repository<Product>
    ){}

    async findAll(): Promise<CategoryResponseDTO[]> {
        const categories = await this.categoryRepo.find()
        if(!categories) throw new NotFoundException("There's no category in database")
   
        return categories.map((category) => new CategoryResponseDTO(category))
    }

    async findOne(categoryId: number): Promise<CategoryResponseDTO> {
        const category = await this.categoryRepo.findOne({ where: { id: categoryId } })
        if(!category) throw new NotFoundException(`Category with id ${categoryId} not found`)

        return new CategoryResponseDTO(category)
    }

    async create(body: CreateCategoryDTO) {
        //If category already exists 
        const existingCategory = await this.categoryRepo.findOne({ where: { name: body.name } })
        if(existingCategory) throw new ConflictException(`Category ${body.name} already exists`)

        //Insert category in database
        const category = this.categoryRepo.create(body)
        await this.categoryRepo.save(category)

        return new CategoryResponseDTO(category)
    }

    async update(body: UpdateCategoryDTO, categoryId: number) {
        const updatedCategory = await this.findOne(categoryId)

        updatedCategory.name = body.name
        await this.categoryRepo.save(updatedCategory)

        return updatedCategory
    }

    async delete(categoryId: number) {
        const existsingCategory = await this.categoryRepo.findOne({ 
            relations: ["products"],
            where: { id: categoryId } 
        })

        if(!existsingCategory) throw new NotFoundException(`Category with ${categoryId} id not found`)

        if(existsingCategory.products?.length) {
            await this.productRepo.delete({ category: { id: categoryId } })
        }

        await this.categoryRepo.delete({ id: categoryId }) 

        return "Category Deleted Successfully"
    }

    async count(): Promise<CategoryCountDTO> {
        const countCategory = await this.categoryRepo.count()
        if(!countCategory) throw new NotFoundException()

        return new CategoryCountDTO(countCategory)
    }
}
