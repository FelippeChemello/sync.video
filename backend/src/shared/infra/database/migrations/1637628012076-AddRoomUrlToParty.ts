import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRoomUrlToParty1637628012076 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'parties',
            new TableColumn({
                name: 'roomUrl',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('parties', 'roomUrl');
    }
}
