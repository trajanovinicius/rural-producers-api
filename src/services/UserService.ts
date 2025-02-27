import { User } from "../models/User";
import { IUserRepository } from "../repositories/UserRepository";
import * as jwt from "jsonwebtoken";

export interface IUserService {
	createUser(data: {
		name: string;
		email: string;
		password: string;
	}): Promise<User>;
	login(
		email: string,
		password: string
	): Promise<{ user: User; token: string }>;
}

export class UserService implements IUserService {
	constructor(private userRepository: IUserRepository) {}

	async createUser(data: {
		name: string;
		email: string;
		password: string;
	}): Promise<User> {
		const existingUser = await this.userRepository.findByEmail(data.email);
		if (existingUser) {
			throw new Error("Email is already in use!");
		}

		const user = new User();
		user.name = data.name;
		user.email = data.email;
		user.password = data.password;

		return this.userRepository.create(user);
	}

	async login(
		email: string,
		password: string
	): Promise<{ user: User; token: string }> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new Error("User not found!");
		}

		const isPasswordValid = await user.verifyPassword(password);
		if (!isPasswordValid) {
			throw new Error("Invalid password!");
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET || "seu-segredo-aqui",
			{ expiresIn: "1h" }
		);

		return { user, token };
	}
}
