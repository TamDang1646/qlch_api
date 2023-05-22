import {
    MigrationInterface,
    QueryRunner,
    Table,
} from "typeorm";

export class CreateBillsTable1684493020276 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bills",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        length: "11",
                        isPrimary: true,
                    },
                    {
                        name: "customerId",
                        type: "int",
                        length: "11",
                        isUnique: true
                    },
                    {
                        name: "itemId",
                        type: "varchar",
                        length: "50",
                        isUnique: true
                    },
                    {
                        name: "start",
                        type: "timestamp",
                        default: "current_timestamp()",
                        isNullable: true,
                    },
                    {
                        name: "end",
                        type: "timestamp",
                        default: "current_timestamp()",
                        isNullable: true,
                    },
                    {
                        name: "address",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "deposit",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "totalPrice",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "paid",
                        type: "int",
                        default: "0"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "current_timestamp()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "current_timestamp()",
                    },
                ],
            }),
        );

    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("bills");
    }

}
