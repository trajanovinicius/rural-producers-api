import { ProducerService } from "../services/ProducerService";

import { IUserRepository } from "../repositories/UserRepository";
import { Producer } from "../models/Producer";
import { Farm } from "../models/Farm";
import { Crop } from "../models/Crop";
import { User } from "../models/User";
import { IProducerRepository } from "../contracts/IProducerRepository";
import { IFarmRepository } from "../contracts/IFarmRepository";
import { ICropRepository } from "../contracts/ICropRepository";

describe("ProducerService", () => {
	let producerService: ProducerService;
	let mockProducerRepository: jest.Mocked<IProducerRepository>;
	let mockFarmRepository: jest.Mocked<IFarmRepository>;
	let mockCropRepository: jest.Mocked<ICropRepository>;
	let mockUserRepository: jest.Mocked<IUserRepository>;

	beforeEach(() => {
		mockProducerRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			findAll: jest.fn(),
			getDashboardData: jest.fn(),
		} as jest.Mocked<IProducerRepository>;

		mockFarmRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		} as jest.Mocked<IFarmRepository>;

		mockCropRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		} as jest.Mocked<ICropRepository>;

		mockUserRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			findByEmail: jest.fn(),
		} as jest.Mocked<IUserRepository>;

		producerService = new ProducerService(
			mockProducerRepository,
			mockFarmRepository,
			mockCropRepository,
			mockUserRepository
		);
	});

	it("should create a producer with farms and crops", async () => {
		const userId = 1;
		const data = {
			document: "12345678909",
			name: "João Silva",
			farms: [
				{
					name: "Fazenda Boa Vista",
					city: "Uberlândia",
					state: "MG",
					totalArea: 100,
					arableArea: 70,
					vegetationArea: 30,
					crops: [{ name: "Soja", harvest: "Safra 2021" }],
				},
			],
		};

		const user = new User();
		user.id = userId;
		user.name = "Maria Silva";
		user.email = "maria@example.com";
		mockUserRepository.findById.mockResolvedValue(user);

		const savedProducer = new Producer();
		savedProducer.id = 1;
		savedProducer.document = data.document;
		savedProducer.name = data.name;
		savedProducer.user = user;
		savedProducer.farms = [];
		mockProducerRepository.create.mockResolvedValue(savedProducer);

		const savedFarm = new Farm();
		savedFarm.id = 1;
		savedFarm.name = data.farms[0].name;
		savedFarm.city = data.farms[0].city;
		savedFarm.state = data.farms[0].state;
		savedFarm.totalArea = data.farms[0].totalArea;
		savedFarm.arableArea = data.farms[0].arableArea;
		savedFarm.vegetationArea = data.farms[0].vegetationArea;
		savedFarm.producer = savedProducer;
		savedFarm.crops = [];
		mockFarmRepository.create.mockResolvedValue(savedFarm);

		const savedCrop = new Crop();
		savedCrop.id = 1;
		savedCrop.name = data.farms[0].crops[0].name;
		savedCrop.harvest = data.farms[0].crops[0].harvest;
		savedCrop.farm = savedFarm;
		mockCropRepository.create.mockResolvedValue(savedCrop);

		const result = await producerService.createProducer(userId, data);

		expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
		expect(mockProducerRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				document: data.document,
				name: data.name,
				user,
			})
		);
		expect(mockFarmRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: data.farms[0].name,
				city: data.farms[0].city,
				state: data.farms[0].state,
				totalArea: data.farms[0].totalArea,
				arableArea: data.farms[0].arableArea,
				vegetationArea: data.farms[0].vegetationArea,
				producer: savedProducer,
			})
		);
		expect(mockCropRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: data.farms[0].crops[0].name,
				harvest: data.farms[0].crops[0].harvest,
				farm: savedFarm,
			})
		);
		expect(result.document).toBe(data.document);
		expect(result.farms).toHaveLength(1);
		expect(result.farms[0].crops).toHaveLength(1);
		expect(result.farms[0].crops[0].name).toBe("Soja");
	});

	it("should update a producer with new farms and crops", async () => {
		const producerId = 1;
		const userId = 1;
		const updateData = {
			document: "98765432100",
			name: "João Atualizado",
			farms: [
				{
					name: "Fazenda Nova",
					city: "São Paulo",
					state: "SP",
					totalArea: 150,
					arableArea: 100,
					vegetationArea: 50,
					crops: [{ name: "Milho", harvest: "Safra 2022" }],
				},
			],
		};

		const user = new User();
		user.id = userId;
		user.name = "Maria Silva";
		user.email = "maria@example.com";

		const existingProducer = new Producer();
		existingProducer.id = producerId;
		existingProducer.document = "12345678909";
		existingProducer.name = "João Silva";
		existingProducer.user = user;
		existingProducer.farms = [
			Object.assign(new Farm(), {
				id: 1,
				name: "Fazenda Velha",
				city: "Uberlândia",
				state: "MG",
				totalArea: 100,
				arableArea: 70,
				vegetationArea: 30,
				crops: [
					Object.assign(new Crop(), {
						id: 1,
						name: "Trigo",
						harvest: "Safra 2020",
					}),
				],
			}),
		];

		const updatedProducer = new Producer();
		updatedProducer.id = producerId;
		updatedProducer.document = updateData.document;
		updatedProducer.name = updateData.name;
		updatedProducer.user = user;
		updatedProducer.farms = [];

		mockProducerRepository.findById.mockResolvedValue(existingProducer);
		mockProducerRepository.update.mockResolvedValue(updatedProducer);
		mockFarmRepository.delete.mockResolvedValue(undefined);

		const savedFarm = new Farm();
		savedFarm.id = 2;
		savedFarm.name = updateData.farms[0].name;
		savedFarm.city = updateData.farms[0].city;
		savedFarm.state = updateData.farms[0].state;
		savedFarm.totalArea = updateData.farms[0].totalArea;
		savedFarm.arableArea = updateData.farms[0].arableArea;
		savedFarm.vegetationArea = updateData.farms[0].vegetationArea;
		savedFarm.producer = updatedProducer;
		savedFarm.crops = [];
		mockFarmRepository.create.mockResolvedValue(savedFarm);

		const savedCrop = new Crop();
		savedCrop.id = 2;
		savedCrop.name = updateData.farms[0].crops[0].name;
		savedCrop.harvest = updateData.farms[0].crops[0].harvest;
		savedCrop.farm = savedFarm;
		mockCropRepository.create.mockResolvedValue(savedCrop);

		const result = await producerService.updateProducer(
			producerId,
			updateData,
			userId
		);

		expect(mockProducerRepository.findById).toHaveBeenCalledWith(producerId);
		expect(mockProducerRepository.update).toHaveBeenCalledWith(
			expect.objectContaining({
				id: producerId,
				document: updateData.document,
				name: updateData.name,
			})
		);
		expect(mockFarmRepository.delete).toHaveBeenCalledWith(1);
		expect(mockFarmRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: updateData.farms[0].name,
				city: updateData.farms[0].city,
				state: updateData.farms[0].state,
				totalArea: updateData.farms[0].totalArea,
				arableArea: updateData.farms[0].arableArea,
				vegetationArea: updateData.farms[0].vegetationArea,
				producer: updatedProducer,
			})
		);
		expect(mockCropRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: updateData.farms[0].crops[0].name,
				harvest: updateData.farms[0].crops[0].harvest,
				farm: savedFarm,
			})
		);
		expect(result.document).toBe(updateData.document);
		expect(result.farms).toHaveLength(1);
		expect(result.farms[0].crops).toHaveLength(1);
		expect(result.farms[0].crops[0].name).toBe("Milho");
	});

	it("should delete a producer with farms and crops", async () => {
		const producerId = 1;
		const userId = 1;

		const user = new User();
		user.id = userId;
		user.name = "Maria Silva";
		user.email = "maria@example.com";

		const existingProducer = new Producer();
		existingProducer.id = producerId;
		existingProducer.document = "12345678909";
		existingProducer.name = "João Silva";
		existingProducer.user = user;
		existingProducer.farms = [
			Object.assign(new Farm(), {
				id: 1,
				name: "Fazenda Boa Vista",
				city: "Uberlândia",
				state: "MG",
				totalArea: 100,
				arableArea: 70,
				vegetationArea: 30,
				crops: [
					Object.assign(new Crop(), {
						id: 1,
						name: "Soja",
						harvest: "Safra 2021",
					}),
				],
			}),
		];

		mockProducerRepository.findById.mockResolvedValue(existingProducer);
		mockCropRepository.delete.mockResolvedValue(undefined);
		mockFarmRepository.delete.mockResolvedValue(undefined);
		mockProducerRepository.delete.mockResolvedValue(undefined);

		await producerService.deleteProducer(producerId, userId);

		expect(mockProducerRepository.findById).toHaveBeenCalledWith(producerId);
		expect(mockCropRepository.delete).toHaveBeenCalledWith(1);
		expect(mockFarmRepository.delete).toHaveBeenCalledWith(1);
		expect(mockProducerRepository.delete).toHaveBeenCalledWith(producerId);
	});

	it("should throw error when updating a producer not owned by the user", async () => {
		const producerId = 1;
		const userId = 2;
		const updateData = {
			document: "98765432100",
			name: "João Atualizado",
		};

		const user = new User();
		user.id = 1;
		user.name = "Maria Silva";
		user.email = "maria@example.com";

		const existingProducer = new Producer();
		existingProducer.id = producerId;
		existingProducer.document = "12345678909";
		existingProducer.name = "João Silva";
		existingProducer.user = user;
		existingProducer.farms = [];

		mockProducerRepository.findById.mockResolvedValue(existingProducer);

		await expect(
			producerService.updateProducer(producerId, updateData, userId)
		).rejects.toThrow("Você só pode atualizar produtores que criou");
	});

	it("should throw error when deleting a producer not owned by the user", async () => {
		const producerId = 1;
		const userId = 2;

		const user = new User();
		user.id = 1;
		user.name = "Maria Silva";
		user.email = "maria@example.com";

		const existingProducer = new Producer();
		existingProducer.id = producerId;
		existingProducer.document = "12345678909";
		existingProducer.name = "João Silva";
		existingProducer.user = user;
		existingProducer.farms = [];

		mockProducerRepository.findById.mockResolvedValue(existingProducer);

		await expect(
			producerService.deleteProducer(producerId, userId)
		).rejects.toThrow("Você só pode deletar produtores que criou");
	});
});
