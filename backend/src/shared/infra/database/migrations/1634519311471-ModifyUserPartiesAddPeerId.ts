import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUserPartiesAddPeerId1634519311471
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users_parties',
            new TableColumn({
                name: 'peerId',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users_parties', 'peerId');
    }
}
