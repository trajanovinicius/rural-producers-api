import { DataSource, Repository } from "typeorm";
import { Crop } from "../models/Crop";
import { ICropRepository } from "../contracts/ICropRepository";

export class CropRepository implements ICropRepository {
  private cropRepo: Repository<Crop>;

  constructor(dataSource: DataSource) {
    this.cropRepo = dataSource.getRepository(Crop);
  }

  async create(crop: Crop): Promise<Crop> {
    return this.cropRepo.save(crop);
  }

  async findById(id: number): Promise<Crop | null> {
    return this.cropRepo.findOne({
      where: { id },
      relations: ["farm"],
    });
  }

  async update(crop: Crop): Promise<Crop> {
    return this.cropRepo.save(crop);
  }

  async delete(id: number): Promise<void> {
    await this.cropRepo.delete(id);
  }
}
