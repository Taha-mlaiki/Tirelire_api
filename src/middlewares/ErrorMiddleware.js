export default class ErrorMiddleware {
  static handle(err, req, res, next) {
    console.error('Erreur:', err.message);
    res.status(err.status || 500).json({
      message: err.message || 'Erreur interne du serveur'
    });
  }
}
