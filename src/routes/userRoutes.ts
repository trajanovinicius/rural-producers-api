import { Router } from "express";
import { UserController } from "../controllers/UserController";

export default function userRoutes(controller: UserController) {
  const router = Router();

  router.post("/users", (req, res) => controller.create(req, res));
  router.post("/login", (req, res) => controller.login(req, res));

  return router;
}
