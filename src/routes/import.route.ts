import express, { Router } from 'express';
import { importPOIData } from '../controllers/import.controller';
import { importPOIDataValidator, validate } from '../validations/import.validation';

const router: Router = express.Router();
/**
 * Router configuration for handling the `/import-data` endpoint.
 * This route is used to process import data requests with validation middleware.
 */
router.route('/import-data').post(validate(importPOIDataValidator.body), importPOIData)

export default router;

