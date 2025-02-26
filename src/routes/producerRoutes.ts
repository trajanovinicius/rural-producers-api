import { Router } from "express";
import { ProducerController } from "../controllers/ProducerController";
import { authMiddleware } from "../middlewares/authMiddleware";

export default function producerRoutes(controller: ProducerController) {
	const router = Router();

	router.post("/producers", authMiddleware, (req, res) =>
		controller.create(req, res)
	);
	router.put("/producers/:id", authMiddleware, (req, res) =>
		controller.update(req, res)
	);
	router.delete("/producers/:id", authMiddleware, (req, res) =>
		controller.delete(req, res)
	);
	router.get("/dashboard", authMiddleware, (req, res) =>
		controller.getDashboard(req, res)
	);

	return router;
}
