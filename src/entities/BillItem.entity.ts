import {
    BaseEntity,
    Column,
    Entity,
} from "typeorm";

@Entity("bills-item")
export class BillItems extends BaseEntity {

    @Column("int", { primary: true, name: "id", generated: "increment", })
    id: number;

    @Column("int", { name: "billId" })
    billId: number;

    @Column("int", { name: "itemId" })
    itemId: number;

    @Column("varchar", { name: "size" })
    size: string;

    @Column("int", { name: "quantity" })
    quantity: number;

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
    constructor(partial: Partial<BillItems>) {
        super();
        Object.assign(this, partial);
    }
}
