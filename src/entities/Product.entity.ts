import { BaseEntity, Column, Entity } from "typeorm";

@Entity("products")
export class Product extends BaseEntity {
    @Column("int", { primary: true, name: "id", generated: "increment" })
    id: number;

    @Column("varchar", { name: "name", length: 500 })
    name: string;

    @Column("int", { name: "type" })
    type: number;

    @Column("varchar", {
        name: "size",
        nullable: true,
        length: 100,
        default: "''",
    })
    size: string | null;

    @Column("varchar", {
        name: "price",
        nullable: true,
        length: 100,
        default: "''",
    })
    price: string | null;

    @Column("int", {
        name: "quantity",
        default: 0,
    })
    quantity: number;

    @Column("varchar", {
        name: "image",
        nullable: true,
        default: "''",
    })
    image: string | null;

    @Column("timestamp", {
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt: Date;

    @Column("timestamp", {
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP",
    })
    updatedAt: Date;
    constructor(partial: Partial<Product>) {
        super();
        Object.assign(this, partial);
    }
}
