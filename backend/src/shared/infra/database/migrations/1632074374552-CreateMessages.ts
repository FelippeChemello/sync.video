import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMessages1632074374552 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'messages',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        generationStrategy: 'increment',
                        isGenerated: true,
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'partyId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'text',
                        type: 'text',
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
                        name: 'MessageUser',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['userId'],
                    },
                    {
                        name: 'MessageParty',
                        referencedTableName: 'parties',
                        referencedColumnNames: ['id'],
                        columnNames: ['partyId'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('messages');
    }
}
