import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '../../../../users/infra/database/entities/User';
import Party from './Party';

@Entity('messages')
export default class Message {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    partyId: number;

    @ManyToOne(() => Party)
    @JoinColumn({ name: 'partyId' })
    party: Party;

    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
