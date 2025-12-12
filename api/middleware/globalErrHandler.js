export const globalErrhandler = (err, req, res, next) => {
  //stack
  //message
  console.error("=== GLOBAL ERROR HANDLER ===");
  console.error("Error:", err);
  console.error("Error name:", err?.name);
  console.error("Error message:", err?.message);
  console.error("Error stack:", err?.stack);

  const stack = err?.stack;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  const message = err?.message;
  res.status(statusCode).json({
    stack,
    message,
  });
};

//404 handler
export const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} Not Found`);
  err.statusCode = 404;
  next(err);
};
