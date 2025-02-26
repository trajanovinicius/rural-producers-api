import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
	level: "info",
	format: combine(
		timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		colorize(),
		customFormat
	),
	transports: [
		new transports.Console(),

		new DailyRotateFile({
			filename: "logs/application-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			maxSize: "20m",
			maxFiles: "14d",
		}),

		new DailyRotateFile({
			filename: "logs/error-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			level: "error",
			maxSize: "20m",
			maxFiles: "14d",
		}),
	],
});
