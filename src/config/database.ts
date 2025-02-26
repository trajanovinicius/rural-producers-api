import { DataSource } from "typeorm";
import { Producer } from "../models/Producer";
import { Farm } from "../models/Farm";
import { Crop } from "../models/Crop";
import { User } from "../models/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "rural_producers",
  entities: [User, Producer, Farm, Crop],
  migrations: ["src/migrations/*.ts"],
  migrationsRun: false,
});
