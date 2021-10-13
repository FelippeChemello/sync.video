import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyVideosAddIsPlayingAndPlaybackration1634094519638
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('videos', [
            new TableColumn({
                name: 'isPlaying',
                type: 'boolean',
                isNullable: false,
                default: false,
            }),
            new TableColumn({
                name: 'playbackRate',
                type: 'float',
                isNullable: false,
                default: 1,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('videos', ['isPlaying', 'playbackRate']);
    }
}
