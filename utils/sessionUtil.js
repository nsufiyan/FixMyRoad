const validateSession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.json({
      success: false,
      message: "No Active Session, please login again.",
    });
  }
};

module.exports = { validateSession };
