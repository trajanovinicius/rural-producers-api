import { DataSource, Repository } from "typeorm";
import { User } from "../models/User";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  private userRepo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  async create(user: User): Promise<User> {
    await user.hashPassword();
    return this.userRepo.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: ["producers"] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: ["producers"],
    });
  }
}
