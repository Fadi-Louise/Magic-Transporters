import { Router } from "express";
import magicMoverRoutes from "./magicMoverRoutes";
import magicItemRoutes from "./magicItemRoutes";

const router = Router();

router.use("/movers", magicMoverRoutes);
router.use("/items", magicItemRoutes);

export default router;
