# Desafio - API de Pedidos (Node.js + JavaScript)

API CRUD para gerenciamento de pedidos com persistencia em SQL (SQLite), incluindo mapeamento do payload externo para o modelo interno do banco.

## Requisitos

- Node.js 18+
- npm

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

API sobe em `http://localhost:3000`.

## Autenticacao JWT

As rotas de pedidos exigem token Bearer.

### Login

`POST /auth/login`

```bash
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data '{
  "username": "admin",
  "password": "123456"
}'
```

Resposta:

```json
{
  "token": "<JWT>"
}
```

Variaveis de ambiente usadas:
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AUTH_USERNAME`
- `AUTH_PASSWORD`

## Swagger

Documentacao interativa disponivel em:
- `http://localhost:3000/api-docs`

## Mapeamento aplicado

Payload de entrada:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

Modelo salvo no banco:

```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

## Estrutura SQL

Tabela `Order`
- `orderId` (PK)
- `value`
- `creationDate`

Tabela `Items`
- `id` (PK autoincrement)
- `orderId` (FK para `Order.orderId`)
- `productId`
- `quantity`
- `price`

## Endpoints

Todos os endpoints abaixo exigem header:
- `Authorization: Bearer <token>`

### Criar pedido

`POST /order`

```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

### Buscar pedido por ID

`GET /order/:orderId`

```bash
curl --location 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Authorization: Bearer <token>'
```

### Listar pedidos

`GET /order/list`

```bash
curl --location 'http://localhost:3000/order/list' \
--header 'Authorization: Bearer <token>'
```

### Atualizar pedido

`PUT /order/:orderId`

```bash
curl --location --request PUT 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "9999",
      "quantidadeItem": 3,
      "valorItem": 5000
    }
  ]
}'
```

### Deletar pedido

`DELETE /order/:orderId`

```bash
curl --location --request DELETE 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Authorization: Bearer <token>'
```

## Status HTTP e erros

- `201` pedido criado
- `200` consulta/listagem/atualizacao
- `204` exclusao
- `400` validacao de payload
- `401` nao autenticado
- `404` pedido nao encontrado
- `409` pedido duplicado
- `500` erro interno

As respostas de erro seguem o formato:

```json
{
  "error": "mensagem"
}
```
