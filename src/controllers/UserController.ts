import { Request, Response } from "express";
import { Container } from "../containers/Container";
import { IUserService } from "../services/UserService";
import { handleRequest } from "../utils/controllerUtils";

export class UserController {
	private userService: IUserService;

	constructor() {
		this.userService = Container.get<IUserService>("IUserService");
	}

	async create(req: Request, res: Response) {
		await handleRequest(
			req,
			res,
			null,
			() => this.userService.createUser(req.body),
			201,
			(user) => ({ id: user.id, name: user.name, email: user.email })
		);
	}

	async login(req: Request, res: Response) {
		await handleRequest(
			req,
			res,
			null,
			() => this.userService.login(req.body.email, req.body.password),
			200,
			({ user, token }) => ({
				id: user.id,
				name: user.name,
				email: user.email,
				token,
			})
		);
	}
}
