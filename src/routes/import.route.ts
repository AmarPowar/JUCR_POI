import express, { Router } from 'express';
import { importPOIData } from '../controllers/import.controller';

const router: Router = express.Router();

router.route('/import-data').post(importPOIData)

export default router;

