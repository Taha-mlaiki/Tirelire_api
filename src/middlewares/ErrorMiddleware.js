export default class ErrorMiddleware {
  static handle(err, _, res) {
    res.status(err.status || 500).json({
      message: err.message || 'Erreur interne du serveur',
    });
  }
}
