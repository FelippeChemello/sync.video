import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddConnectedColumnToUsersPartiesRelationship1638046055600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users_parties',
            new TableColumn({
                name: 'connected',
                type: 'boolean',
                isNullable: false,
                default: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users_parties', 'connected');
    }

}
