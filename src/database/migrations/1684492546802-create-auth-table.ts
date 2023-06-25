import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuthTable1684492546802 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "auth",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        length: "11",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "12",
                        isUnique: true,
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "int",
                        length: "1",
                        default: "0",
                        comment: "user role",
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("auth");
    }
}
