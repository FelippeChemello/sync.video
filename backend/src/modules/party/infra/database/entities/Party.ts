import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';

import User from '../../../../users/infra/database/entities/User';
import PartiesUsersRelationship from './PartiesUsersRelationship';
import Video from './Video';

@Entity('parties')
export default class Party {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ownerId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @OneToMany(
        () => PartiesUsersRelationship,
        relationship => relationship.party,
        { cascade: true },
    )
    partiesUsersRelationship: PartiesUsersRelationship[];

    @Column()
    roomUrl: string;

    @OneToMany(() => Video, video => video.party, { cascade: true })
    videos: Video[];

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;
}
