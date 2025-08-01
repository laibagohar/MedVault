
import userRoutes from "./userRoutes.js";
import reportRoutes from "./reportRoutes.js";
import express from "express";
const apiRoutes = express.Router();

apiRoutes.use(userRoutes);
apiRoutes.use(reportRoutes);

export default apiRoutes;

