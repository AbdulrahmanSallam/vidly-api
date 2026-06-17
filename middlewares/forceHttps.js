module.exports = function (req, res, next) {
  if (req.protocol === "http") {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};
