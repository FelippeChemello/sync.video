import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVideosTable1634082625436 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'videos',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isPrimary: true,
                    },
                    {
                        name: 'partyId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'url',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'second',
                        type: 'int',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'type',
                        type: 'enum',
                        enum: ['url', 'magnet'],
                        isNullable: false,
                        // default: 'url',
                    },
                    {
                        name: 'isActive',
                        comment: 'This column means that if true is last played video',
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
                ],
                foreignKeys: [
                    {
                        name: 'PartyVideos',
                        referencedTableName: 'parties',
                        referencedColumnNames: ['id'],
                        columnNames: ['partyId'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('videos');
    }
}
