import { Producer } from "../models/Producer";

export interface IProducerRepository {
  create(producer: Producer): Promise<Producer>;
  findById(id: number): Promise<Producer | null>;
  update(producer: Producer): Promise<Producer>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Producer[]>;
  getDashboardData(): Promise<any>;
}
