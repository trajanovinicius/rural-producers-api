export interface IProducer {
  id: number;
  document: string;
  name: string;
  farms: IFarm[];
}

export interface IFarm {
  id: number;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  crops: ICrop[];
}

export interface ICrop {
  id: number;
  name: string;
  harvest: string;
}
