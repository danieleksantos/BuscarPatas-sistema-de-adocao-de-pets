import { Router } from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js'; 
import { getDashboardCounts, getPublicAdoptionCount } from '../controllers/dashboardController.js'; 

const router = Router();

router.get('/counts', protect, isAdmin, getDashboardCounts); 
router.get('/public-counts', getPublicAdoptionCount); 

export default router;