import { Farm } from "../models/Farm";

export interface IFarmRepository {
  create(farm: Farm): Promise<Farm>;
  findById(id: number): Promise<Farm | null>;
  update(farm: Farm): Promise<Farm>;
  delete(id: number): Promise<void>;
}
