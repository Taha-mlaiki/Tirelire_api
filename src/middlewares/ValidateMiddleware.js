export default class ValidateMiddleware {
  static validate(schema) {
    return async (req, res, next) => {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: 'Erreur de validation',
          errors: result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      req.validatedData = result.data;
      next();
    };
  }
}
