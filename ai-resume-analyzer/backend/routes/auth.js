import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  profile,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { runValidation } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  runValidation,
  register
);
// Helpful GET for humans visiting the endpoint in a browser
router.get("/register", (req, res) => {
  res.json({
    message:
      "This endpoint accepts POST requests. Send name, email and password as JSON to register.",
    example: {
      name: "Alice",
      email: "alice@example.com",
      password: "secret123",
    },
  });
});
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  runValidation,
  login
);
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);

export default router;
