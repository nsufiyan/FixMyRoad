const validateSession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.json({
      success: false,
      message: "No active session, please login again.",
    });
  }
};

module.exports = { validateSession };
