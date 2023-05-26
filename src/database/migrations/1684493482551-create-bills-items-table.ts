import {
    MigrationInterface,
    QueryRunner,
    Table,
} from "typeorm";

export class CreateBillsItemsTable1684493482551 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bills-item",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        length: "11",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "billId",
                        type: "int",
                        length: "11",
                    },
                    {
                        name: "itemId",
                        type: "varchar",
                        length: "50",
                    },
                    {
                        name: "size",
                        type: "varchar",
                        length: "50",
                    },
                    {
                        name: "quantity",
                        type: "int",
                        length: "11",
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
        await queryRunner.dropTable("bills-item");
    }

}
