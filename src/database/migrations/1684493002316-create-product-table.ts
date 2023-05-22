import {
    MigrationInterface,
    QueryRunner,
    Table,
} from "typeorm";

export class CreateProductTable1684493002316 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
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
                        name: "name",
                        type: "varchar",
                        length: "500",
                    },
                    {
                        name: "type",
                        type: "int",
                        default: "0",
                    },
                    {
                        name: "size",
                        type: "varchar",
                    },
                    {
                        name: "price",
                        type: "varchar",
                        default: "0"
                    },
                    {
                        name: "quantity",
                        type: "int",
                        default: "0"
                    },
                    {
                        name: "image",
                        type: "varchar",
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
        await queryRunner.dropTable("products");
    }

}
