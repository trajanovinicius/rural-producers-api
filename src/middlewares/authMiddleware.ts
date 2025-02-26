import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

export interface AuthenticatedRequest extends Request {
	user?: { userId: number; email: string };
}

export function authMiddleware(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token not provided" });
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "seu-segredo-aqui"
		) as {
			userId: number;
			email: string;
		};
		req.user = decoded; // Adiciona o usuário decodificado ao request
		next();
	} catch (error: any) {
		logger.error(`Error in request: ${error.message}`, { stack: error.stack });
		return res.status(401).json({ message: "Invalid or expired token" });
	}
}
