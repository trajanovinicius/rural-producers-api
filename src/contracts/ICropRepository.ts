import { Crop } from "../models/Crop";

export interface ICropRepository {
  create(crop: Crop): Promise<Crop>;
  findById(id: number): Promise<Crop | null>;
  update(crop: Crop): Promise<Crop>;
  delete(id: number): Promise<void>;
}
