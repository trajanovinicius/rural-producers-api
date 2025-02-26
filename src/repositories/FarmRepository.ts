import { DataSource, Repository } from "typeorm";
import { Farm } from "../models/Farm";
import { IFarmRepository } from "../contracts/IFarmRepository";
import { logger } from "../utils/logger";

export class FarmRepository implements IFarmRepository {
	private farmRepo: Repository<Farm>;

	constructor(dataSource: DataSource) {
		this.farmRepo = dataSource.getRepository(Farm);
	}

	async create(farm: Farm): Promise<Farm> {
		return this.farmRepo.save(farm);
	}

	async findById(id: number): Promise<Farm | null> {
		return this.farmRepo.findOne({
			where: { id },
			relations: ["producer", "crops"],
		});
	}

	async update(farm: Farm): Promise<Farm> {
		const existingFarm = await this.findById(farm.id);
		if (!existingFarm) {
			logger.error(`Farm with ID ${farm.id} not found`);
			throw new Error(`Farm with ID ${farm.id} not found`);
		}

		this.farmRepo.merge(existingFarm, farm);
		return this.farmRepo.save(existingFarm);
	}

	async delete(id: number): Promise<void> {
		const farm = await this.findById(id);
		if (!farm) {
			logger.error(`Farm with ID ${id} not found`);
			throw new Error(`Farm with ID ${id} not found`);
		}

		await this.farmRepo.delete(id);
	}
}
