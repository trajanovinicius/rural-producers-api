import { Producer } from "../models/Producer";

export interface IProducerService {
  createProducer(userId: number, data: any): Promise<Producer>;
  updateProducer(id: number, data: any, userId: number): Promise<Producer>;
  deleteProducer(id: number, userId: number): Promise<void>;
  getDashboard(): Promise<any>;
}
