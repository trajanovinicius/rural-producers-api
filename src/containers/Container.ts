import { AppDataSource } from "../config/database";
import { ProducerRepository } from "../repositories/ProducerRepository";
import { FarmRepository } from "../repositories/FarmRepository";
import { CropRepository } from "../repositories/CropRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ProducerService } from "../services/ProducerService";
import { UserService } from "../services/UserService";
import { ProducerController } from "../controllers/ProducerController";
import { UserController } from "../controllers/UserController";

export class Container {
  private static dependencies: Map<string, any> = new Map();

  static initialize() {
    const producerRepository = new ProducerRepository(AppDataSource);
    this.dependencies.set("IProducerRepository", producerRepository);

    const farmRepository = new FarmRepository(AppDataSource);
    this.dependencies.set("IFarmRepository", farmRepository);

    const cropRepository = new CropRepository(AppDataSource);
    this.dependencies.set("ICropRepository", cropRepository);

    const userRepository = new UserRepository(AppDataSource);
    this.dependencies.set("IUserRepository", userRepository);

    const producerService = new ProducerService(
      producerRepository,
      farmRepository,
      cropRepository,
      userRepository
    );
    this.dependencies.set("IProducerService", producerService);

    const userService = new UserService(userRepository);
    this.dependencies.set("IUserService", userService);

    this.dependencies.set("ProducerController", new ProducerController());
    this.dependencies.set("UserController", new UserController());
  }

  static get<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found in container`);
    }
    return dependency as T;
  }
}
