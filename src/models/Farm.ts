import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Producer } from "./Producer";
import { Crop } from "./Crop";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  totalArea!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  arableArea!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  vegetationArea!: number;

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    onDelete: "CASCADE",
  })
  producer!: Producer;

  @OneToMany(() => Crop, (crop) => crop.farm, { cascade: true })
  crops!: Crop[];
}
