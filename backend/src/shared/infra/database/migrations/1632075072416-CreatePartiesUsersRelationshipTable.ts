import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePartiesUsersRelationshipTable1632075072416
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users_parties',
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
                        name: 'partyId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'socketId',
                        type: 'varchar',
                        isNullable: true,
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
                        name: 'User',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['userId'],
                    },
                    {
                        name: 'Party',
                        referencedTableName: 'parties',
                        referencedColumnNames: ['id'],
                        columnNames: ['partyId'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_parties');
    }
}
