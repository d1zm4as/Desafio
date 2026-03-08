const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { initializeDatabase } = require('./db/database');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerSpec = require('./docs/swagger');
const { authMiddleware } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandler');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  return res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(authRoutes);
app.use(authMiddleware, orderRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);

(async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`API executando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Falha ao inicializar API:', error);
    process.exit(1);
  }
})();
