import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTables1700000000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "user",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "name",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "email",
						type: "varchar",
						isUnique: true,
						isNullable: false,
					},
					{
						name: "password",
						type: "varchar",
						isNullable: false,
					},
				],
			}),
			true
		);

		await queryRunner.createTable(
			new Table({
				name: "producer",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "document",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "name",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "userId",
						type: "int",
						isNullable: false,
					},
				],
				foreignKeys: [
					{
						columnNames: ["userId"],
						referencedTableName: "user",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
						name: "FK_producer_user",
					},
				],
			}),
			true
		);

		await queryRunner.createTable(
			new Table({
				name: "farm",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "name",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "city",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "state",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "totalArea",
						type: "decimal",
						precision: 10,
						scale: 2,
						isNullable: false,
					},
					{
						name: "arableArea",
						type: "decimal",
						precision: 10,
						scale: 2,
						isNullable: false,
					},
					{
						name: "vegetationArea",
						type: "decimal",
						precision: 10,
						scale: 2,
						isNullable: false,
					},
					{
						name: "producerId",
						type: "int",
						isNullable: false,
					},
				],
				foreignKeys: [
					{
						columnNames: ["producerId"],
						referencedTableName: "producer",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
						name: "FK_farm_producer",
					},
				],
			}),
			true
		);

		await queryRunner.createTable(
			new Table({
				name: "crop",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "name",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "harvest",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "farmId",
						type: "int",
						isNullable: false,
					},
				],
				foreignKeys: [
					{
						columnNames: ["farmId"],
						referencedTableName: "farm",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
						name: "FK_crop_farm",
					},
				],
			}),
			true
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("crop", true);
		await queryRunner.dropTable("farm", true);
		await queryRunner.dropTable("producer", true);
		await queryRunner.dropTable("users", true);
	}
}
