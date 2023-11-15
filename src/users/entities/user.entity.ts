import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({ unique: true })
    email: string;

    @Column()
    refresh_token: string;

    @Column({ nullable: true })
    access_token_hash: string;

    @Column()
    refresh_token_generate_date: Date
}