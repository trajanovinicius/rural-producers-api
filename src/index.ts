import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/database";
import { Container } from "./containers/Container";
import { ProducerController } from "./controllers/ProducerController";
import { UserController } from "./controllers/UserController";
import producerRoutes from "./routes/producerRoutes";
import userRoutes from "./routes/userRoutes";
import "dotenv/config";
import { logger } from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

(async () => {
	try {
		await AppDataSource.initialize();
		logger.info("Database connected!");

		Container.initialize();
		logger.info("Container initialized!");

		const producerController = new ProducerController();
		const userController = new UserController();

		app.use("/api", producerRoutes(producerController));
		app.use("/api", userRoutes(userController));

		app.listen(3000, () => {
			logger.info("Server running on port 3000");
		});
	} catch (error) {
		console.error("Error starting server:", error);
	}
})();
