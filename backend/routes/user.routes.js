import express from "express";
import { login, logout, register , updateProfile } from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);