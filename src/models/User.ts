import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Producer } from "./Producer";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@OneToMany(() => Producer, (producer) => producer.user, { cascade: true })
	producers!: Producer[];

	async verifyPassword(plainPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, this.password);
	}

	async hashPassword(): Promise<void> {
		if (this.password) {
			this.password = await bcrypt.hash(this.password, 10);
		}
	}
}
