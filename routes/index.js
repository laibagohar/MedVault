import express from "express";
import userRoutes from "./userRoutes.js";
import reportRoutes from "./reportRoutes.js";

const apiRoutes = express.Router();

apiRoutes.use(userRoutes);
apiRoutes.use(reportRoutes);

export default apiRoutes;