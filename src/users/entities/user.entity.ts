import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: false })
    isDeleted: boolean;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    refresh_token: string;

    @Column()
    access_token_hash: string;
}
