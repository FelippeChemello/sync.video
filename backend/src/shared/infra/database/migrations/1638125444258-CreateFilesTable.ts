import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateFilesTable1638125444258 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'files',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isPrimary: true,
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'fileName',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'isAvailable',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'expiresAt',
                        type: 'timestamp',
                        isNullable: true
                    },
                ],
                foreignKeys: [
                    {
                        name: 'userFiles',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['userId'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('files');
    }

}
