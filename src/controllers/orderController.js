const { mapInputToOrder, mapOrderToResponse } = require('../services/orderMapper');
const { createOrder, getOrderById, listOrders, updateOrder, deleteOrder } = require('../services/orderService');

async function create(req, res, next) {
  try {
    const mappedOrder = mapInputToOrder(req.body);
    const created = await createOrder(mappedOrder);

    return res.status(201).json(mapOrderToResponse(created));
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const order = await getOrderById(req.params.orderId);
    return res.status(200).json(mapOrderToResponse(order));
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const orders = await listOrders();
    return res.status(200).json(orders.map(mapOrderToResponse));
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const mappedOrder = mapInputToOrder(req.body);

    const updated = await updateOrder(req.params.orderId, {
      value: mappedOrder.value,
      creationDate: mappedOrder.creationDate,
      items: mappedOrder.items
    });

    return res.status(200).json(mapOrderToResponse(updated));
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await deleteOrder(req.params.orderId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  getById,
  list,
  update,
  remove
};
