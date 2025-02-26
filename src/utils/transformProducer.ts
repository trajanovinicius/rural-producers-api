import { Producer } from "../models/Producer";
import { Farm } from "../models/Farm";
import { Crop } from "../models/Crop";
import { ProducerResponseDTO } from "../dto/ProducerResponseDTO";

export function transformProducerToResponse(
  producer: Producer
): ProducerResponseDTO {
  return {
    id: producer.id,
    document: producer.document,
    name: producer.name,
    farms: producer.farms.map((farm: Farm) => ({
      id: farm.id,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
      crops: farm.crops.map((crop: Crop) => ({
        id: crop.id,
        name: crop.name,
        harvest: crop.harvest,
      })),
    })),
  };
}
