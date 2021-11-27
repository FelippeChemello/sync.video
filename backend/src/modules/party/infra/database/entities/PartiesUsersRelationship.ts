import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';

import User from '../../../../users/infra/database/entities/User';
import Party from './Party';

@Entity('users_parties')
export default class PartiesUsersRelationship {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    @Exclude()
    userId: number;

    @ManyToOne(() => User, user => user.partiesUsersRelationship)
    user: User;

    @Column()
    @Exclude()
    partyId: string;

    @ManyToOne(() => Party, party => party.partiesUsersRelationship)
    party: Party;

    @Column()
    socketId: string;

    @Column()
    peerId: string;

    @Column()
    connected: boolean;

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt: Date;
}
