const { Router } = require('express');
const orderController = require('../controllers/orderController');

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Operacoes de pedidos
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Erro de validacao
 *       401:
 *         description: Nao autorizado
 *       409:
 *         description: Pedido duplicado
 */
router.post('/order', orderController.create);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       401:
 *         description: Nao autorizado
 */
router.get('/order/list', orderController.list);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Busca pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       401:
 *         description: Nao autorizado
 *       404:
 *         description: Pedido nao encontrado
 */
router.get('/order/:orderId', orderController.getById);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualiza pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       401:
 *         description: Nao autorizado
 *       404:
 *         description: Pedido nao encontrado
 */
router.put('/order/:orderId', orderController.update);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deleta pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pedido removido
 *       401:
 *         description: Nao autorizado
 *       404:
 *         description: Pedido nao encontrado
 */
router.delete('/order/:orderId', orderController.remove);

module.exports = router;
