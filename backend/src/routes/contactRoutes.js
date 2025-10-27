import { Router } from 'express';
import { sendContactEmail } from '../controllers/contactController.js';

const router = Router();

// Rota POST para receber os dados do formulário de contato (pública)
router.post('/', sendContactEmail);

export default router;