import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: bigint;

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
}
