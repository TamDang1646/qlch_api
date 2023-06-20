import { Product } from "src/entities/Product.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}
