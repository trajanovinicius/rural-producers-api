import { Request, Response } from "express";
import { ObjectSchema } from "yup";
import { logger } from "./logger";

export async function handleRequest<T>(
  req: Request,
  res: Response,
  schema: ObjectSchema<any> | null,
  action: () => Promise<T>,
  successStatus: number,
  successHandler: (result: T) => any = (result) => result
) {
  try {
    if (schema) {
      await schema.validate(req.body, { abortEarly: false });
    }
    const result = await action();
    const response = successHandler(result);
    if (successStatus === 204) {
      res.status(204).send();
    } else {
      res.status(successStatus).json(response);
    }
  } catch (error: any) {
    logger.error(`Error in request: ${error.message}`, { stack: error.stack });
    res.status(error.status || 400).json({ message: error.message });
  }
}
