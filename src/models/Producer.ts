import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Farm } from "./Farm";
import { User } from "./User";

@Entity()
export class Producer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  document!: string;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.producers, { onDelete: "CASCADE" })
  user!: User;

  @OneToMany(() => Farm, (farm) => farm.producer, { cascade: true })
  farms!: Farm[];
}
