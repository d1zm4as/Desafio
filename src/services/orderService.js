const { connectDatabase } = require('../db/database');
const { AppError } = require('../utils/errors');

async function getItemsByOrderId(db, orderId) {
  return db.all(
    `SELECT productId, quantity, price
     FROM Items
     WHERE orderId = ?
     ORDER BY id ASC`,
    [orderId]
  );
}

async function getOrderById(orderId) {
  const db = await connectDatabase();
  const order = await db.get('SELECT orderId, value, creationDate FROM "Order" WHERE orderId = ?', [orderId]);

  if (!order) {
    throw new AppError('Pedido nao encontrado', 404);
  }

  const items = await getItemsByOrderId(db, orderId);
  await db.close();

  return {
    ...order,
    items
  };
}

async function listOrders() {
  const db = await connectDatabase();
  const orders = await db.all('SELECT orderId, value, creationDate FROM "Order" ORDER BY creationDate DESC');

  const result = [];
  for (const order of orders) {
    const items = await getItemsByOrderId(db, order.orderId);
    result.push({
      ...order,
      items
    });
  }

  await db.close();
  return result;
}

async function createOrder(order) {
  const db = await connectDatabase();
  await db.exec('BEGIN TRANSACTION');

  try {
    const existing = await db.get('SELECT orderId FROM "Order" WHERE orderId = ?', [order.orderId]);
    if (existing) {
      throw new AppError('Pedido com este numero ja existe', 409);
    }

    await db.run(
      `INSERT INTO "Order"(orderId, value, creationDate)
       VALUES (?, ?, ?)`,
      [order.orderId, order.value, order.creationDate]
    );

    for (const item of order.items) {
      await db.run(
        `INSERT INTO Items(orderId, productId, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [order.orderId, item.productId, item.quantity, item.price]
      );
    }

    await db.exec('COMMIT');
    await db.close();
    return getOrderById(order.orderId);
  } catch (error) {
    await db.exec('ROLLBACK');
    await db.close();
    throw error;
  }
}

async function updateOrder(orderId, orderData) {
  const db = await connectDatabase();
  const currentOrder = await db.get('SELECT orderId FROM "Order" WHERE orderId = ?', [orderId]);

  if (!currentOrder) {
    await db.close();
    throw new AppError('Pedido nao encontrado', 404);
  }

  await db.exec('BEGIN TRANSACTION');

  try {
    await db.run(
      `UPDATE "Order"
       SET value = ?, creationDate = ?
       WHERE orderId = ?`,
      [orderData.value, orderData.creationDate, orderId]
    );

    await db.run('DELETE FROM Items WHERE orderId = ?', [orderId]);

    for (const item of orderData.items) {
      await db.run(
        `INSERT INTO Items(orderId, productId, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await db.exec('COMMIT');
    await db.close();
    return getOrderById(orderId);
  } catch (error) {
    await db.exec('ROLLBACK');
    await db.close();
    throw error;
  }
}

async function deleteOrder(orderId) {
  const db = await connectDatabase();
  const order = await db.get('SELECT orderId FROM "Order" WHERE orderId = ?', [orderId]);

  if (!order) {
    await db.close();
    throw new AppError('Pedido nao encontrado', 404);
  }

  await db.run('DELETE FROM "Order" WHERE orderId = ?', [orderId]);
  await db.close();
}

module.exports = {
  getOrderById,
  listOrders,
  createOrder,
  updateOrder,
  deleteOrder
};
