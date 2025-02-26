import { Producer } from "../models/Producer";
import { Farm } from "../models/Farm";
import { Crop } from "../models/Crop";

import { IUserRepository } from "../repositories/UserRepository";
import { IProducerService } from "../contracts/IProducerService";
import { IProducerRepository } from "../contracts/IProducerRepository";
import { IFarmRepository } from "../contracts/IFarmRepository";
import { ICropRepository } from "../contracts/ICropRepository";
import { logger } from "../utils/logger";

export class ProducerService implements IProducerService {
	constructor(
		private producerRepository: IProducerRepository,
		private farmRepository: IFarmRepository,
		private cropRepository: ICropRepository,
		private userRepository: IUserRepository
	) {}

	async createProducer(userId: number, data: any): Promise<Producer> {
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new Error("Usuário não encontrado");
		}

		const producer = new Producer();
		producer.document = data.document;
		producer.name = data.name;
		producer.user = user;

		const savedProducer = await this.producerRepository.create(producer);

		const farms = await Promise.all(
			data.farms.map(async (farmData: any) => {
				const farm = new Farm();
				farm.name = farmData.name;
				farm.city = farmData.city;
				farm.state = farmData.state;
				farm.totalArea = farmData.totalArea;
				farm.arableArea = farmData.arableArea;
				farm.vegetationArea = farmData.vegetationArea;
				farm.producer = savedProducer;

				const savedFarm = await this.farmRepository.create(farm);

				const crops = await Promise.all(
					farmData.crops.map(async (cropData: any) => {
						const crop = new Crop();
						crop.name = cropData.name;
						crop.harvest = cropData.harvest;
						crop.farm = savedFarm;
						return this.cropRepository.create(crop);
					})
				);

				savedFarm.crops = crops;
				return savedFarm;
			})
		);

		savedProducer.farms = farms;
		logger.info(
			`Producer created successfully with ID: ${savedProducer.id} by user ID: ${userId}`
		);
		return savedProducer;
	}

	async updateProducer(
		id: number,
		data: any,
		userId: number
	): Promise<Producer> {
		const producer = await this.producerRepository.findById(id);
		if (!producer) {
			throw new Error("Produtor não encontrado");
		}

		if (producer.user.id !== userId) {
			throw new Error("Você só pode atualizar produtores que criou");
		}

		producer.document = data.document || producer.document;
		producer.name = data.name || producer.name;
		const updatedProducer = await this.producerRepository.update(producer);

		if (data.farms) {
			await Promise.all(
				producer.farms.map((farm) => this.farmRepository.delete(farm.id))
			);

			const farms = await Promise.all(
				data.farms.map(async (farmData: any) => {
					const farm = new Farm();
					farm.name = farmData.name;
					farm.city = farmData.city;
					farm.state = farmData.state;
					farm.totalArea = farmData.totalArea;
					farm.arableArea = farmData.arableArea;
					farm.vegetationArea = farmData.vegetationArea;
					farm.producer = updatedProducer;

					const savedFarm = await this.farmRepository.create(farm);

					const crops = await Promise.all(
						farmData.crops.map(async (cropData: any) => {
							const crop = new Crop();
							crop.name = cropData.name;
							crop.harvest = cropData.harvest;
							crop.farm = savedFarm;
							return this.cropRepository.create(crop);
						})
					);

					savedFarm.crops = crops;
					return savedFarm;
				})
			);

			updatedProducer.farms = farms;
		}

		logger.info(
			`Producer updated successfully with ID: ${updatedProducer.id} by user ID: ${userId}`
		);
		return updatedProducer;
	}

	async deleteProducer(id: number, userId: number): Promise<void> {
		const producer = await this.producerRepository.findById(id);
		if (!producer) {
			throw new Error("Produtor não encontrado");
		}

		if (producer.user.id !== userId) {
			throw new Error("Você só pode deletar produtores que criou");
		}

		await Promise.all(
			producer.farms.map(async (farm) => {
				await Promise.all(
					farm.crops.map((crop) => this.cropRepository.delete(crop.id))
				);
				await this.farmRepository.delete(farm.id);
			})
		);

		await this.producerRepository.delete(id);
		logger.info(
			`Producer deleted successfully with ID: ${id} by user ID: ${userId}`
		);
	}

	async getDashboard(): Promise<any> {
		const dashboardData = await this.producerRepository.getDashboardData();
		logger.info("Dashboard data retrieved successfully");
		return dashboardData;
	}
}
