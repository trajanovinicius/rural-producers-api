export interface ProducerResponseDTO {
  id: number;
  document: string;
  name: string;
  farms: {
    id: number;
    name: string;
    city: string;
    state: string;
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
    crops: {
      id: number;
      name: string;
      harvest: string;
    }[];
  }[];
}
