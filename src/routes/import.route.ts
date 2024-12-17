import express, { Router } from "express";
import { importPOIData } from "../controllers/import.controller";
import {
  importPOIDataValidator,
  validate,
} from "../validations/import.validation";

const router: Router = express.Router();
/**
 * Router configuration for handling the `/import-data` endpoint.
 * This route is used to process import data requests with validation middleware.
 */
router
  .route("/import-data")
  .post(validate(importPOIDataValidator.body), importPOIData);

export default router;
/**
 * @swagger
 * /v1/import-data:
 *   post:
 *     summary: Import POI data with filters
 *     description: This route allows you to import POI data using a POST request with filters in the request body.
 *     operationId: importPOIData
 *     tags:
 *       - POI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: object
 *                 properties:
 *                   countrycode:
 *                     type: string
 *                     example: "US"
 *                   compact:
 *                     type: boolean
 *                     example: true
 *                   verbose:
 *                     type: boolean
 *                     example: false
 *                   output:
 *                     type: string
 *                     enum: [json, xml]
 *                     example: "json"
 *                   opendata:
 *                     type: boolean
 *                     example: true
 *                   distance:
 *                     type: number
 *                     format: float
 *                     example: 50
 *                   page:
 *                     type: integer
 *                     example: 1
 *                   maxresults:
 *                     type: integer
 *                     example: 50
 *             example:
 *               filters:
 *                 countrycode: "US"
 *                 compact: true
 *                 verbose: false
 *                 output: "json"
 *                 opendata: true
 *                 distance: 50
 *                 page: 1
 *                 maxresults: 50
 *     responses:
 *       200:
 *         description: POI data imported successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data imported successfully"
 *       400:
 *         description: Invalid data format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request body"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route('/import-data').post(validate(importPOIDataValidator.body), importPOIData);
