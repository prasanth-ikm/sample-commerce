const createResponse = (statusCode, success, message, data = null, meta = null) => ({
  statusCode,
  success,
  message,
  ...(data && { data }),
  ...(meta && { meta })
});

const responseHandler = {
  success: (res, data, message = 'Success', statusCode = 200, meta = '') => {
    return res.status(statusCode).json(
      createResponse(statusCode, true, message, data, meta)
    );
  },

  error: (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
    const response = createResponse(statusCode, false, message);

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error.message;
      response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
  },

  notFound: (res, message = 'Resource Not Found') => {
    return responseHandler.error(res, message, 404);
  },

  badRequest: (res, message = 'Bad Request', errors = null) => {
    const response = createResponse(statusCode, false, message);
    if (errors) response.errors = errors;
    return res.status(400).json(response);
  },

  unauthorized: (res, message = 'Unauthorized') => {
    return responseHandler.error(res, message, 401);
  },

  forbidden: (res, message = 'Forbidden') => {
    return responseHandler.error(res, message, 403);
  },

  validationError: (res, message = 'Validation Error', errors = '') => {
    const response = createResponse(statusCode, false, message);
    response.errors = errors;
    return res.status(422).json(response);
  },

  paginated: (res, data, pagination, message = 'Paginated results', statusCode = 200) => {
    return res.status(statusCode).json({
      statusCode,
      success: true,
      message,
      data,
      pagination
    });
  }
};

module.exports = { responseHandler }