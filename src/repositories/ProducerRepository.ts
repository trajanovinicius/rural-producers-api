import { DataSource, Repository } from "typeorm";
import { Producer } from "../models/Producer";
import { Farm } from "../models/Farm";
import { Crop } from "../models/Crop";
import { IProducerRepository } from "../contracts/IProducerRepository";

export class ProducerRepository implements IProducerRepository {
	private producerRepo: Repository<Producer>;
	private farmRepo: Repository<Farm>;
	private cropRepo: Repository<Crop>;

	constructor(dataSource: DataSource) {
		this.producerRepo = dataSource.getRepository(Producer);
		this.farmRepo = dataSource.getRepository(Farm);
		this.cropRepo = dataSource.getRepository(Crop);
	}

	async create(producer: Producer): Promise<Producer> {
		return this.producerRepo.save(producer);
	}

	async findById(id: number): Promise<Producer | null> {
		return this.producerRepo.findOne({
			where: { id },
			relations: ["user", "farms", "farms.crops"],
		});
	}

	async update(producer: Producer): Promise<Producer> {
		return this.producerRepo.save(producer);
	}

	async delete(id: number): Promise<void> {
		await this.producerRepo.delete(id);
	}

	async findAll(): Promise<Producer[]> {
		return this.producerRepo.find({
			relations: ["user", "farms", "farms.crops"],
		});
	}

	async getDashboardData(): Promise<any> {
		const totalFarms = await this.farmRepo.count();
		const totalHectares = await this.farmRepo
			.createQueryBuilder("farm")
			.select("SUM(farm.totalArea)", "total")
			.getRawOne();

		const byState = await this.farmRepo
			.createQueryBuilder("farm")
			.select("farm.state, COUNT(*) as count")
			.groupBy("farm.state")
			.getRawMany();

		const byCrop = await this.cropRepo
			.createQueryBuilder("crop")
			.select("crop.name, COUNT(*) as count")
			.groupBy("crop.name")
			.getRawMany();

		const landUse = await this.farmRepo
			.createQueryBuilder("farm")
			.select(
				"SUM(farm.arableArea) as arable, SUM(farm.vegetationArea) as vegetation"
			)
			.getRawOne();

		return {
			totalFarms,
			totalHectares: totalHectares.total,
			byState,
			byCrop,
			landUse,
		};
	}
}
