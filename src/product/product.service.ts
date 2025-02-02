import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductResponseDTO } from './dtos/product-response.dto';
import { Product } from 'src/entities /product.entity';
import { ProductFilterDTO } from './dtos/product-filter.dto';
import { CreateProductDTO } from './dtos/product-create.dto';
import { Category } from 'src/entities /category.entity';
import { Brand } from 'src/entities / brand.entity';
import { ProductImage } from 'src/entities /productImage.entity';
import { UpdateProductDTO } from './dtos/product-update.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
        @InjectRepository(Brand) private brandRepo: Repository<Brand>,
        @InjectRepository(ProductImage) private productImageRepo: Repository<ProductImage>
    ) {}

    async findAll(filter: ProductFilterDTO): Promise<ProductResponseDTO[]> {
        const products = await this.productRepo.find({
            relations: ["category", "images", "brand"],
            skip: filter?.skip || 0,
            take: filter?.limit,
            where: {
                ...(filter.brand ? { brand: { name: filter.brand } } : {}),
                ...(filter.category ? { category: { name: filter.category } } : {}),
                ...(filter.minPrice !== undefined ? { price: MoreThanOrEqual(filter.minPrice) } : {}),
                ...(filter.maxPrice !== undefined ? { price: LessThanOrEqual(filter.maxPrice) } : {})
            }
        })

        if(!products) throw new NotFoundException("There's no product in database")
   
        return products.map((product) => new ProductResponseDTO({
            ...product,
            images: product.images?.map((img) => img.imageUrl) || [],
            brand: product.brand.name,
            category: product.category.name
        }))
    }

    async findOneById(productId: number): Promise<ProductResponseDTO> {
        const product = await this.productRepo.findOne({
            relations: ["category", "images", "brand"],
            where: { id:productId }
        })

        if(!product) throw new NotFoundException(`Product with id ${productId} not found`)

        const newProduct = {
            ...product,
            images: product.images?.map((img) => img.imageUrl) || [],
            brand: product.brand.name,
            category: product.category.name
        }

        return new ProductResponseDTO(newProduct)
    }

    async findOneByName(productName: string): Promise<ProductResponseDTO> {
        const product = await this.productRepo.findOne({
            relations: ["category", "images", "brand"],
            where: { name: productName }
        })

        if(!product) throw new NotFoundException(`Product with name ${productName} not found`)            

        const newProduct = {
            ...product,
            brand: product.brand.name,
            category: product.category.name,
            images: product.images?.map((img) => img.imageUrl) || []
        }

        return new ProductResponseDTO(newProduct)
    }

    async create(body: CreateProductDTO) {
        try {   
            //Find or Create the brand
            let brandEntity = await this.brandRepo.findOne({ where: { name: body.brand } })
            if(!brandEntity) {
                brandEntity = this.brandRepo.create({ name: body.brand })
                await this.brandRepo.save(brandEntity)
            }

            //Find or Create the category
            let categoryEntity = await this.categoryRepo.findOne({ where: { name: body.category } })
            if(!categoryEntity) {
                categoryEntity = this.categoryRepo.create({ name: body.category })
                await this.categoryRepo.save(categoryEntity)
            }

            const product = await this.productRepo.create({
                name: body.name,
                description: body.description,
                price: body.price,
                stock: body.stock,
                brand: brandEntity,
                category: categoryEntity,
                images: body.images?.map((image) => this.productImageRepo.create({ imageUrl: image })) || []
            })

            //Save product into database
            await this.productRepo.save(product)
        
            const productResponse = {
                ...product, 
                brand: product.brand.name,
                category: product.category.name,
                images: product.images?.map((img) => img.imageUrl) || []
            }

            return new ProductResponseDTO(productResponse)
            
        } catch(error) {
            //Postgres Duplicate Key Error
            if(error.code === "23505") {
                throw new ConflictException("Prouct with this name already exist")   
            }
            throw new InternalServerErrorException("Failed to create product")
        }
    }

    async update(body: UpdateProductDTO, productId: number) {
        //Check if product to update exists
        const existingProduct = await this.productRepo.findOne({ 
            relations: ["category", "brand", "images"],
            where: { id: productId } 
        })

        if(!existingProduct) throw new NotFoundException(`Product with id ${productId} not found`)

        //Check if another product with the same name are already exists
        if(body.name && body.name !== existingProduct.name) {
            const productWithSameName = await this.productRepo.findOne({ where: { name: body.name } })
            
            if(productWithSameName) throw new ConflictException(`Product with ${body.name} name already exists`)
        }

        //Find or Create the brand if it's being updated
        if(body.brand) {
            let brandEntity = await this.brandRepo.findOne({ where: { name: body.brand } })
            
            if(!brandEntity) {
                brandEntity = this.brandRepo.create({ name: body.brand })
                await this.brandRepo.save(brandEntity)
            }
            existingProduct.brand = brandEntity
        }
          
        //Find or Create the category if it's being updated
        if(body.category) {
            let categoryEntity = await this.categoryRepo.findOne({ where: { name: body.category } })   

            if(!categoryEntity) {
                categoryEntity = this.brandRepo.create({ name: body.category })
                await this.categoryRepo.save(categoryEntity)
            }
            existingProduct.category = categoryEntity
        }

        //Update images if provided
        if(body.images) {
            //Clear existing images
            await this.productImageRepo.delete({ product: existingProduct })

            //Adding new images
            existingProduct.images = body.images.map((image) => this.productImageRepo.create({ imageUrl: image }))
        }

        //Update the rest of fielfd
        existingProduct.name = body.name || existingProduct.name
        existingProduct.description = body.description || existingProduct.description
        existingProduct.price = body.price || existingProduct.price
        existingProduct.stock = body.stock || existingProduct.stock

        //Save updated product in database
        this.productRepo.save(existingProduct)

        return {
            ...existingProduct,
            brand: existingProduct.brand.name,
            category: existingProduct.category.name,
            images: existingProduct.images?.map((image) => image.imageUrl) || [],
        }
    }

    async delete(productId: number) {
        //Check if product to delete exists
        const existingProduct = await this.productRepo.findOne({ 
            relations: ["images"],
            where: { id: productId }
        })

        if(!existingProduct) throw new NotFoundException(`Product with ${productId} id not found`)

        //Delete associated images first
        if(existingProduct.images?.length) {
            await this.productImageRepo.delete({ product: { id: productId } })   
        }

        //Then delete the product
        await this.productRepo.delete({ id: productId })

        return "Product Deleted Successfully"
    }
}
