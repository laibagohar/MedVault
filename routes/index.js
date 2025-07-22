import userRoutes from "./userRoutes.js";
import express from "express";
const apiRoutes = express.Router();

apiRoutes.use(userRoutes);

export default apiRoutes;