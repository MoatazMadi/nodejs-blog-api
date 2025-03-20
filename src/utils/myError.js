function myCustomError(status, message) {
  const err = new Error(message || "");
  err.status = status || null;
  return err;
}

module.exports = myCustomError;
