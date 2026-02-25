import { Router } from "express";
import { MagicItemController } from "../controllers/MagicItemController";

const router = Router();

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Add a new Magic Item
 *     tags: [Magic Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, weight]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Golden Amulet"
 *               weight:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", MagicItemController.create);

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all Magic Items
 *     tags: [Magic Items]
 *     responses:
 *       200:
 *         description: List of all magic items
 */
router.get("/", MagicItemController.getAll);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get a Magic Item by ID
 *     tags: [Magic Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Magic Item ID
 *     responses:
 *       200:
 *         description: The Magic Item
 *       404:
 *         description: Item not found
 */
router.get("/:id", MagicItemController.getById);

export default router;
