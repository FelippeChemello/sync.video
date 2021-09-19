import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateParties1632073883173 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'parties',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        isGenerated: true,
                    },
                    {
                        name: 'ownerId',
                        type: 'int',
                        isNullable: false,
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
                ],
                foreignKeys: [
                    {
                        name: 'OwnerUser',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['ownerId'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('parties');
    }
}
