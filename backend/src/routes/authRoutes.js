import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login } from '../controllers/authController.js';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';

router.post('/register', register);
router.post('/login', login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed`, session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=user_not_found`);
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("Erro Crítico: JWT_SECRET não definida no .env ou não carregada.");
      return res.redirect(`${FRONTEND_URL}/login?error=jwt_config_error`);
    }

    const token = jwt.sign(
      { id: req.user.auth_id, role: req.user.role },
      jwtSecret,
      { expiresIn: '8h' }
    );

    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

export default router;
