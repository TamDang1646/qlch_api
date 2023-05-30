import { BaseEntity, Column, Entity } from "typeorm";

@Entity("bills")
export class Bills extends BaseEntity {
  @Column("int", { primary: true, name: "id", generated: "increment" })
  id: number;

  @Column("int", { name: "customerId" })
  customerId: number;

  @Column("timestamp", {
    name: "start",
    default: () => "CURRENT_TIMESTAMP",
  })
  start: number | string | Date;

  @Column("timestamp", {
    name: "end",
    default: () => "CURRENT_TIMESTAMP",
  })
  end: number | string | Date;

  @Column("varchar", {
    name: "address",
    nullable: true,
    length: 255,
    default: "''",
  })
  address: string | null;

  @Column("varchar", {
    name: "deposit",
    nullable: true,
  })
  deposit: string;

  @Column("varchar", {
    name: "totalPrice",
    nullable: true,
  })
  totalPrice: string;

  @Column("int", {
    name: "paid",
    default: 0,
  })
  paid: number;

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
  constructor(partial: Partial<Bills>) {
    super();
    Object.assign(this, partial);
  }
}
