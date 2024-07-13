const ensureAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send({ message: "Forbidden" });
  }
};

module.exports = {
  ensureAdmin,
};
