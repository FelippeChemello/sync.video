import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Generated,
} from 'typeorm';

@Entity('userTokens')
class UserToken {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    @Generated('uuid')
    token: string;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default UserToken;
