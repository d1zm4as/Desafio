const { AppError } = require('../utils/errors');

function toInteger(value, fieldName) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new AppError(`Campo ${fieldName} precisa ser numerico`, 400);
  }

  return parsed;
}

function parseCreationDate(value) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError('Campo dataCriacao invalido', 400);
  }

  return parsed.toISOString();
}

function mapInputToOrder(payload) {
  const { numeroPedido, valorTotal, dataCriacao, items } = payload;

  if (!numeroPedido || typeof numeroPedido !== 'string') {
    throw new AppError('Campo numeroPedido e obrigatorio e deve ser string', 400);
  }

  if (valorTotal === undefined || valorTotal === null) {
    throw new AppError('Campo valorTotal e obrigatorio', 400);
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Campo items deve ser um array com pelo menos um item', 400);
  }

  const order = {
    orderId: numeroPedido,
    value: toInteger(valorTotal, 'valorTotal'),
    creationDate: parseCreationDate(dataCriacao),
    items: items.map((item, index) => {
      if (item.idItem === undefined) {
        throw new AppError(`Campo items[${index}].idItem e obrigatorio`, 400);
      }

      if (item.quantidadeItem === undefined) {
        throw new AppError(`Campo items[${index}].quantidadeItem e obrigatorio`, 400);
      }

      if (item.valorItem === undefined) {
        throw new AppError(`Campo items[${index}].valorItem e obrigatorio`, 400);
      }

      return {
        productId: toInteger(item.idItem, `items[${index}].idItem`),
        quantity: toInteger(item.quantidadeItem, `items[${index}].quantidadeItem`),
        price: toInteger(item.valorItem, `items[${index}].valorItem`)
      };
    })
  };

  return order;
}

function mapOrderToResponse(order) {
  return {
    numeroPedido: order.orderId,
    valorTotal: order.value,
    dataCriacao: order.creationDate,
    items: order.items.map((item) => ({
      idItem: String(item.productId),
      quantidadeItem: item.quantity,
      valorItem: item.price
    }))
  };
}

module.exports = {
  mapInputToOrder,
  mapOrderToResponse
};
