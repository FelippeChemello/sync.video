import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMetadataToVideos1638166538678 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('videos', [
            new TableColumn({
                name: 'title',
                type: 'text',
                isNullable: true,
            }),
            new TableColumn({
                name: 'description',
                type: 'text',
                isNullable: true,
            }),
            new TableColumn({
                name: 'uploadedAt',
                type: 'text',
                isNullable: true,
            }),
            new TableColumn({
                name: 'thumbnail',
                type: 'text',
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('videos', 'metadata');
    }
}
