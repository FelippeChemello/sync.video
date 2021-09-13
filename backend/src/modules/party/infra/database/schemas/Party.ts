import { User } from './User';
import {
    Column,
    CreateDateColumn,
    Entity,
    ObjectID,
    ObjectIdColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Message } from './Message';

@Entity('parties', { database: 'mongo' })
export default class Party {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    owner: User;

    @Column()
    participants: User[];

    @Column()
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(owner: User) {
        this.owner = owner;
        this.participants = [owner];
    }
}
