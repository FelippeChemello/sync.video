import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUsersAddAvatarColumn1631077458833
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'avatar',
                comment: 'Base64 encoded',
                type: 'text',
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'avatar');
    }
}
