import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Party from '../../../../party/infra/database/entities/Party';
import PartiesUsersRelationship from '../../../../party/infra/database/entities/PartiesUsersRelationship';

@Entity('users')
class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    avatar: string;

    @ManyToMany(
        () => PartiesUsersRelationship,
        relationship => relationship.user,
    )
    partiesUsersRelationship: PartiesUsersRelationship[];

    @Column()
    @Exclude()
    password: string;

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;
}

export default User;
