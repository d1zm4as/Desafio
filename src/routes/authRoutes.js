const { Router } = require('express');
const jwt = require('jsonwebtoken');

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       401:
 *         description: Credenciais invalidas
 */
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  const validUser = process.env.AUTH_USERNAME || 'admin';
  const validPassword = process.env.AUTH_PASSWORD || '123456';

  if (username !== validUser || password !== validPassword) {
    return res.status(401).json({ error: 'Credenciais invalidas' });
  }

  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  const token = jwt.sign(
    { username },
    secret,
    { expiresIn }
  );

  return res.status(200).json({ token });
});

module.exports = router;
