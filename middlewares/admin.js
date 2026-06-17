module.exports = function (req, res, next) {
  if (!req.user.isAdmin) {
    res.staus(403).send("Access denied.");
  }
  next();
};
