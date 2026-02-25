import { Router } from "express";
import { MagicMoverController } from "../controllers/MagicMoverController";

const router = Router();

/**
 * @swagger
 * /api/movers:
 *   post:
 *     summary: Add a new Magic Mover
 *     tags: [Magic Movers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, weightLimit]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Swift Carrier"
 *               weightLimit:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Mover created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", MagicMoverController.create);

/**
 * @swagger
 * /api/movers/leaderboard:
 *   get:
 *     summary: Get movers sorted by most completed missions (descending)
 *     tags: [Magic Movers]
 *     responses:
 *       200:
 *         description: List of movers sorted by missions completed
 */
router.get("/leaderboard", MagicMoverController.getLeaderboard);

/**
 * @swagger
 * /api/movers:
 *   get:
 *     summary: Get all Magic Movers
 *     tags: [Magic Movers]
 *     responses:
 *       200:
 *         description: List of all magic movers
 */
router.get("/", MagicMoverController.getAll);

/**
 * @swagger
 * /api/movers/{id}:
 *   get:
 *     summary: Get a Magic Mover by ID
 *     tags: [Magic Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The Magic Mover
 *       404:
 *         description: Mover not found
 */
router.get("/:id", MagicMoverController.getById);

/**
 * @swagger
 * /api/movers/{id}/load:
 *   post:
 *     summary: Load a Magic Item onto a Magic Mover
 *     tags: [Magic Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Magic Mover ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId]
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the Magic Item to load
 *     responses:
 *       200:
 *         description: Item loaded successfully
 *       400:
 *         description: Cannot load (on mission / weight exceeded)
 *       404:
 *         description: Mover or Item not found
 */
router.post("/:id/load", MagicMoverController.loadItem);

/**
 * @swagger
 * /api/movers/{id}/start-mission:
 *   put:
 *     summary: Start a mission for a Magic Mover
 *     tags: [Magic Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mission started
 *       400:
 *         description: Already on mission or no items loaded
 *       404:
 *         description: Mover not found
 */
router.put("/:id/start-mission", MagicMoverController.startMission);

/**
 * @swagger
 * /api/movers/{id}/end-mission:
 *   put:
 *     summary: End a mission for a Magic Mover
 *     tags: [Magic Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mission ended, items unloaded
 *       400:
 *         description: Mover is not on a mission
 *       404:
 *         description: Mover not found
 */
router.put("/:id/end-mission", MagicMoverController.endMission);

export default router;
