import { Expose } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import api from '../../../../../config/api'

import User from '../../../../users/infra/database/entities/User';

@Entity('files')
export default class File {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    uploader: User;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    fileName: string;

    @Column()
    isAvailable: boolean;

    @Expose({ name: 'url' })
    getUrl(): string {
        return `${api.url}/files/${this.fileName}`;
    }

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    expiresAt: Date;
}
