import { BaseEntity, Column, Entity } from "typeorm";

@Entity("customers")
export class Customer extends BaseEntity {
    @Column("int", { primary: true, name: "id", generated: "increment" })
    id: number;

    @Column("varchar", { name: "code", length: 12 })
    code: string;

    @Column("varchar", { name: "phone_number", length: 50 })
    phoneNumber: string;

    @Column("varchar", {
        name: "email",
        nullable: true,
        length: 100,
        default: "''",
    })
    email: string | null;

    @Column("varchar", {
        name: "name",
        nullable: true,
        length: 100,
        default: "''",
    })
    name: string | null;

    @Column("tinyint", {
        name: "gender",
        default: 0,
        comment: "0: other | 1: male | 2: female",
    })
    gender: number;

    @Column("varchar", {
        name: "address",
        nullable: true,
        length: 255,
        default: "''",
    })
    address: string | null;

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
    constructor(partial: Partial<Customer>) {
        super();
        Object.assign(this, partial);
    }
}
