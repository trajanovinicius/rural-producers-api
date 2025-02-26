import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Farm } from "./Farm";

@Entity()
export class Crop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
  @Column()
  harvest!: string;

  @ManyToOne(() => Farm, (farm) => farm.crops, { onDelete: "CASCADE" })
  farm!: Farm;
}
