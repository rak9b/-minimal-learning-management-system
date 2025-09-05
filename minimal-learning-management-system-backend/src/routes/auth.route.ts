import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { USER_ROLE } from "../enum/user";
import Authentication from "../middlewares/auth";
import ValidateRequestAPI from "../middlewares/validationRequest";
import { AuthValidation } from "../validation/auth.validation";

const router = express.Router();

router.post(
  "/login",
  ValidateRequestAPI(AuthValidation.loginUserValidation),
  AuthController.loginUser
);
router.post(
  "/register",
  ValidateRequestAPI(AuthValidation.registerUserValidation),
  AuthController.registerUser
);
router.get(
  "/profile",
  Authentication(USER_ROLE.USER),
  AuthController.getUserProfile
);

export const AuthRoute = router;
