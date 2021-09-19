import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    OneToOne,
    JoinColumn,
} from 'typeorm';

import User from '../../../../users/infra/database/entities/User';
import Message from './Message';
import PartiesUsersRelationship from './PartiesUsersRelationship';

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
    )
    partiesUsersRelationship: PartiesUsersRelationship[];

    @OneToMany(() => Message, message => message.party)
    messages: Message[];

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;
}
