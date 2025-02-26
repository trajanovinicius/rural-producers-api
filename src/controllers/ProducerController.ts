import { Response } from "express";
import { Container } from "../containers/Container";
import { producerSchema } from "../validators/producerValidator";
import { handleRequest } from "../utils/controllerUtils";
import { transformProducerToResponse } from "../utils/transformProducer";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { IProducerService } from "../contracts/IProducerService";

export class ProducerController {
  private producerService: IProducerService;

  constructor() {
    this.producerService = Container.get<IProducerService>("IProducerService");
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("Unauthorized user");
    }

    await handleRequest(
      req,
      res,
      producerSchema,
      () => this.producerService.createProducer(userId, req.body),
      201,
      transformProducerToResponse
    );
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("Unauthorized user");
    }

    await handleRequest(
      req,
      res,
      producerSchema,
      () => this.producerService.updateProducer(id, req.body, userId),
      200,
      transformProducerToResponse
    );
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("Unauthorized user");
    }

    await handleRequest(
      req,
      res,
      null,
      () => this.producerService.deleteProducer(id, userId),
      204,
      () => undefined
    );
  }

  async getDashboard(req: AuthenticatedRequest, res: Response) {
    await handleRequest(
      req,
      res,
      null,
      () => this.producerService.getDashboard(),
      200
    );
  }
}
