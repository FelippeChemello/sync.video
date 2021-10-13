import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import Party from './Party';

@Entity('videos')
export default class Video {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    @Exclude()
    partyId: string;

    @ManyToOne(() => Party)
    @JoinColumn({ name: 'partyId' })
    party: Party;

    @Column()
    url: string;

    @Column()
    second: number;

    @Column()
    type: 'url' | 'magnet';

    @Column()
    isActive: boolean;

    @Column()
    isPlaying: boolean;

    @Column()
    playbackRate: number;

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;
}
