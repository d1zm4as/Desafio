function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    error: message
  });
}

module.exports = {
  errorHandler
};
